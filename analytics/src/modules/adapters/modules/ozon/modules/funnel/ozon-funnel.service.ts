import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import axios from 'axios';
import { OzonFunnelEntity } from './entities/ozon-funnel.entity';
import { OzonFunnelHistoryEntity } from './entities/ozon-funnel-history.entity';
import { SyncSnapshotsService } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.service';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { SyncResult } from 'src/modules/sync/modules/sync-snapshots/models/sync-result.interface';
import { sleep } from 'src/utils/sleep';
import { chunkArray } from 'src/utils/chunk-array';
import { OzonFunnelCleanupOptions } from './models/funnel-cleanup-options.interface';
import { excludeSnapshots } from 'src/utils/exclude-snapshots';

@Injectable()
export class OzonFunnelService {
    private readonly logger = new Logger(OzonFunnelService.name);
    private readonly apiUrl = 'https://api-seller.ozon.ru/v1/analytics/data';

    constructor(
        private readonly dataSource: DataSource,
        private readonly syncSnapshotsService: SyncSnapshotsService
    ) { }

    private async *streamFunnel(clientId: string, apiKey: string) {
        const limit = 1000;
        let offset = 0;

        const dateRange = this.getDateRange();

        const options = {
            headers: {
                'Client-Id': clientId,
                'Api-Key': apiKey,
                'Content-Type': 'application/json',
            }
        }

        do {
            const payload = {
                date_from: dateRange.dateFrom,
                date_to: dateRange.dateTo,
                metrics: [
                    "revenue", "ordered_units", "hits_view", "hits_view_search",
                    "hits_view_pdp", "hits_tocart", "hits_tocart_search",
                    "hits_tocart_pdp", "session_view", "session_view_search",
                    "session_view_pdp", "returns", "cancellations", "position_category"
                ],
                dimension: ["sku", "day"],
                filters: [],
                sort: [
                    { key: "revenue", order: "DESC" }
                ],
                limit: limit,
                offset: offset
            }

            const { data } = await axios.post(this.apiUrl, payload, options);
            const rawItems = data?.result?.data || [];
            const funnels = this.groupItemsToFunnels(rawItems);

            if (!funnels.length) break;

            yield funnels;

            offset += limit;
            if (rawItems.length < limit) break;
            await sleep(60000);
        } while (true);
    }

    private getDateRange() {
        const dateTo = new Date();
        const dateFrom = new Date(dateTo);
        dateFrom.setMonth(dateFrom.getMonth() - 3);
        dateFrom.setDate(dateFrom.getDate() + 1);

        return {
            dateFrom: dateFrom.toISOString().slice(0, 10),
            dateTo: dateTo.toISOString().slice(0, 10)
        };
    }

    private groupItemsToFunnels(items: any[]): any[] {
        const funnelsMap = items.reduce((acc: { [sku: string]: any }, current: any) => {
            const sku = current.dimensions[0].id
            const name = current.dimensions[0].name
            const historyItem = {
                date: current.dimensions[1].id,
                metrics: current.metrics
            }

            if (!acc[sku]) {
                acc[sku] = {
                    sku: sku,
                    name: name,
                    history: [historyItem]
                }
            } else {
                acc[sku].history.push(historyItem)
            }

            return acc
        }, {})

        return Object.values(funnelsMap);
    }

    private async cleanupFunnel(manager: EntityManager, options: OzonFunnelCleanupOptions) {
        const chunkSize = 300;

        if (options.snapshotId && options.skus && options.skus.length > 0) {
            const chunks = chunkArray<string>(options.skus, chunkSize);
            for (const chunk of chunks) {
                await manager.getRepository(OzonFunnelEntity).delete({
                    datasource_id: options.datasourceId,
                    snapshot_id: Not(options.snapshotId),
                    sku: In(chunk)
                });
            }
        } else if (options.snapshotId) {
            await manager.getRepository(OzonFunnelEntity).delete({
                datasource_id: options.datasourceId,
                snapshot_id: options.snapshotId
            });
        }
    }

    async syncFunnels(clientId: string, apiKey: string, dataSourceId: string, mode: SyncMode): Promise<SyncResult> {
        const manager = this.dataSource.manager
        const snapshot = await this.syncSnapshotsService.create(dataSourceId, SyncScope.Funnel, mode);
        const funnelRepository = this.dataSource.getRepository(OzonFunnelEntity);
        const funnelHistoryRepository = this.dataSource.getRepository(OzonFunnelHistoryEntity);
        const snapshotsInProgress = await this.syncSnapshotsService.getLoading(dataSourceId, SyncScope.Funnel);
        const snapshotsIds = snapshotsInProgress.map(snapshot => snapshot.id);

        try {
            const newFunnelSkus = new Set<string>();

            for await (const funnels of this.streamFunnel(clientId, apiKey)) {
                const skus = funnels.map(funnel => funnel.sku);
                let write = 0;
                let rewrite = 0;

                const existingFunnels = await funnelRepository.find({
                    where: {
                        datasource_id: dataSourceId,
                        snapshot_id: snapshot.id,
                        sku: In(skus)
                    },
                    relations: {
                        history: true
                    }
                });

                const existingMap = new Map(existingFunnels.map(f => [f.sku, f]));

                const funnelsToSave = funnels.map(funnel => {
                    let funnelEntity: OzonFunnelEntity;

                    if (existingMap.has(funnel.sku)) {
                        rewrite++;
                        funnelEntity = existingMap.get(funnel.sku)!;
                    } else {
                        write++;
                        funnelEntity = manager.create(OzonFunnelEntity, {
                            datasource_id: dataSourceId,
                            snapshot_id: snapshot.id,
                            sku: funnel.sku,
                            name: funnel.name,
                            history: []
                        })
                    }

                    (funnel.history || []).forEach(history => {
                        funnelEntity.history.push(
                            manager.create(OzonFunnelHistoryEntity, {
                                date: history.date,
                                revenue: history.metrics[0],
                                ordered_units: history.metrics[1],
                                hits_view: history.metrics[2],
                                hits_view_search: history.metrics[3],
                                hits_view_pdp: history.metrics[4],
                                hits_tocart: history.metrics[5],
                                hits_tocart_search: history.metrics[6],
                                hits_tocart_pdp: history.metrics[7],
                                session_view: history.metrics[8],
                                session_view_search: history.metrics[9],
                                session_view_pdp: history.metrics[10],
                                returns: history.metrics[11],
                                cancellations: history.metrics[12],
                                position_category: history.metrics[13]
                            })
                        );
                    });

                    return funnelEntity;
                });

                funnelsToSave.forEach(funnel => newFunnelSkus.add(funnel.sku));
                await funnelRepository.save(funnelsToSave, { chunk: 50 });
                if (write) {
                    this.logger.log(`Чанк из ${write} воронок записан (snapshot ${snapshot.id})`);
                }
                if (rewrite) {
                    this.logger.log(`Чанк из ${rewrite} воронок перезаписан (snapshot ${snapshot.id})`);
                }
            }

            const newFunnels = await this.dataSource.getRepository(OzonFunnelEntity).find({
                where: {
                    datasource_id: dataSourceId,
                    snapshot_id: snapshot.id,
                    sku: In(Array.from(newFunnelSkus))
                },
                relations: {
                    history: true
                }
            });

            const oldFunnels = await this.dataSource.getRepository(OzonFunnelEntity).find({
                where: {
                    datasource_id: dataSourceId,
                    snapshot_id: excludeSnapshots(snapshotsIds),
                    sku: In(Array.from(newFunnelSkus))
                },
                relations: {
                    history: true
                }
            });
            const oldMap = new Map(oldFunnels.map(f => [f.sku, f]));

            for (const funnel of newFunnels) {
                const oldFunnel = oldMap.get(funnel.sku);
                if (!oldFunnel) continue;

                const newDates = new Set(funnel.history.map(h => h.date));

                for (const oldHistory of oldFunnel.history) {
                    if (!newDates.has(oldHistory.date)) [
                        funnel.history.push(
                            funnelHistoryRepository.create({
                                date: oldHistory.date,
                                revenue: oldHistory.revenue,
                                ordered_units: oldHistory.ordered_units,
                                hits_view: oldHistory.hits_view,
                                hits_view_search: oldHistory.hits_view_search,
                                hits_view_pdp: oldHistory.hits_view_pdp,
                                hits_tocart: oldHistory.hits_tocart,
                                hits_tocart_search: oldHistory.hits_tocart_search,
                                hits_tocart_pdp: oldHistory.hits_tocart_pdp,
                                session_view: oldHistory.session_view,
                                session_view_search: oldHistory.session_view_search,
                                session_view_pdp: oldHistory.session_view_pdp,
                                returns: oldHistory.returns,
                                cancellations: oldHistory.cancellations,
                                position_category: oldHistory.position_category
                            })
                        )
                    ]
                }
            }

            await funnelRepository.save(newFunnels, { chunk: 50 });
            this.logger.log(`История из старых воронок перезаписана (snapshot ${snapshot.id})`);

            await this.dataSource.transaction(async (manager: EntityManager) => {
                const oldSnapshot = await this.syncSnapshotsService.getActive(dataSourceId, SyncScope.Funnel);

                if (oldSnapshot) {
                    await this.syncSnapshotsService.archive(manager, oldSnapshot.id);
                }

                await this.cleanupFunnel(manager, {
                    datasourceId: dataSourceId,
                    snapshotId: snapshot.id,
                    skus: Array.from(newFunnelSkus)
                })

                await this.syncSnapshotsService.activate(manager, snapshot.id);
            });

            return {
                snapshotId: snapshot.id,
                success: true
            }
        } catch (error) {
            await this.cleanupFunnel(manager, {
                datasourceId: dataSourceId,
                snapshotId: snapshot.id
            })
            await this.syncSnapshotsService.fail(snapshot.id);
            this.logger.error('Ошибка при синхронизации Ozon воронок!', error);
            return {
                snapshotId: snapshot.id,
                success: false,
                error: `Ошибка при синхронизации воронок: ${error?.message || 'Неизвестная ошибка'}`
            }
        }
    }

    async getAllFunnels(dataSourceId: string) {
        const snapshotsInProgress = await this.syncSnapshotsService.getLoading(dataSourceId, SyncScope.Funnel);
        const snapshotsIds = snapshotsInProgress.map(s => s.id);

        return this.dataSource.getRepository(OzonFunnelEntity).find({
            where: {
                datasource_id: dataSourceId,
                snapshot_id: excludeSnapshots(snapshotsIds)
            },
            relations: {
                history: true
            },
            order: {
                history: {
                    date: 'ASC'
                }
            }
        })
    }
}
