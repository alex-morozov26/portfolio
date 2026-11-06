import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import axios from 'axios';
import { WbFunnelEntity } from './entities/wb-funnel.entity';
import { WbFunnelHistoryEntity } from './entities/wb-funnel-history.entity';
import { WbProductEntity } from 'src/modules/adapters/modules/wb/modules/products/entities/wb-product.entity';
import { sleep } from 'src/utils/sleep';
import { SyncSnapshotsService } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.service';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { SyncResult } from 'src/modules/sync/modules/sync-snapshots/models/sync-result.interface';
import { chunkArray } from 'src/utils/chunk-array';
import { WbFunnelCleanupOptions } from './models/funnel-cleanup-options.interface';
import { excludeSnapshots } from 'src/utils/exclude-snapshots';

@Injectable()
export class WbFunnelService {
    private readonly logger = new Logger(WbFunnelService.name);
    private readonly apiUrl = 'https://seller-analytics-api.wildberries.ru/api/analytics/v3/sales-funnel/products/history';

    constructor(
        private readonly dataSource: DataSource,
        private readonly syncSnapshotsService: SyncSnapshotsService
    ) { }

    private async *streamFunnels(apiToken: string, dataSourceId: string) {
        const chunkSize = 20;
        const dateRange = this.getDateRange();
        const snapshot = await this.syncSnapshotsService.getActive(dataSourceId, SyncScope.Products);
        if (!snapshot) {
            yield [];
            return;
        }
        const products = await this.dataSource
            .getRepository(WbProductEntity)
            .find({ 
                select: { 
                    nm_id: true
                },
                where: {
                    datasource_id: dataSourceId,
                    snapshot_id: snapshot.id
                }
            });
        const nmIds = products.map(product => product.nm_id);
        const chunks = chunkArray<string>(nmIds, chunkSize);

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i].map(id => Number(id));

            const payload = {
                selectedPeriod: {
                    start: dateRange.startDate,
                    end: dateRange.endDate
                },
                nmIds: chunk,
                skipDeletedNm: false,
                aggregationLevel: "day"
            };

            const { data } = await axios.post(this.apiUrl, payload, {
                headers: {
                    Authorization: apiToken,
                    'Content-Type': 'application/json',
                },
            });

            yield data;

            if (i < chunks.length - 1) {
                await sleep(20000);
            }
        }
    }

    private getDateRange() {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);
        
        return {
            startDate: sevenDaysAgo.toISOString().slice(0, 10),
            endDate: today.toISOString().slice(0, 10)
        };
    }

    private mapToEntity(manager: EntityManager, dataSourceId: string, snapshotId: string, funnel: any): WbFunnelEntity {
        return manager.create(WbFunnelEntity, {
            datasource_id: dataSourceId,
            snapshot_id: snapshotId,
            nm_id: funnel.product.nmId,
            title: funnel.product.title,
            vendor_code: funnel.product.vendorCode,
            brand_name: funnel.product.brandName,
            subject_id: funnel.product.subjectId,
            subject_name: funnel.product.subjectName,
            history: (funnel.history || []).map(history =>
                manager.create(WbFunnelHistoryEntity, {
                    date: history.date,
                    open_count: history.openCount,
                    cart_count: history.cartCount,
                    order_count: history.orderCount,
                    order_sum: history.orderSum,
                    buyout_count: history.buyoutCount,
                    buyout_sum: history.buyoutSum,
                    buyout_percent: history.buyoutPercent,
                    add_to_cart_conversion: history.addToCartConversion,
                    cart_to_order_conversion: history.cartToOrderConversion,
                    add_to_wishlist_count: history.addToWishlistCount
                })
            )
        })
    }

    private async cleanupFunnel(manager: EntityManager, options: WbFunnelCleanupOptions) {
        const chunkSize = 300;

        if (options.snapshotId && options.nmIds && options.nmIds.length > 0) {
            const chunks = chunkArray<string>(options.nmIds, chunkSize);
            for (const chunk of chunks) {
                await manager.getRepository(WbFunnelEntity).delete({
                    datasource_id: options.datasourceId,
                    snapshot_id: Not(options.snapshotId),
                    nm_id: In(chunk)
                });
            }
        } else if (options.snapshotId) {
            await manager.getRepository(WbFunnelEntity).delete({
                datasource_id: options.datasourceId,
                snapshot_id: options.snapshotId
            });
        }
    }

    async syncFunnels(apiToken: string, dataSourceId: string, mode: SyncMode): Promise<SyncResult> {
        const manager = this.dataSource.manager;
        const snapshot = await this.syncSnapshotsService.create(dataSourceId, SyncScope.Funnel, mode);
        const funnelRepository = this.dataSource.getRepository(WbFunnelEntity);
        const funnelHistoryRepository = this.dataSource.getRepository(WbFunnelHistoryEntity);
        const snapshotsInProgress = await this.syncSnapshotsService.getLoading(dataSourceId, SyncScope.Funnel);
        const snapshotsIds = snapshotsInProgress.map(snapshot => snapshot.id);

        try {
            const newFunnelsNmIds = new Set<string>();

            for await (const funnels of this.streamFunnels(apiToken, dataSourceId)) {
                const funnelsToSave = funnels.map(funnel => this.mapToEntity(
                    manager, dataSourceId, snapshot.id, funnel
                ));

                const oldFunnels = await this.dataSource.getRepository(WbFunnelEntity).find({
                    where: {
                        datasource_id: dataSourceId,
                        snapshot_id: excludeSnapshots(snapshotsIds),
                        nm_id: In(funnelsToSave.map(funnel => funnel.nm_id))
                    },
                    relations: {
                        history: true
                    }
                });
                const oldMap = new Map(oldFunnels.map(f => [f.nm_id, f]));

                for (const funnel of funnelsToSave) {
                    const oldFunnel = oldMap.get(funnel.nm_id.toString());
                    if (!oldFunnel) continue;

                    const newDates = new Set(funnel.history.map(h => h.date));

                    for (const oldHistory of oldFunnel.history) {
                        if (!newDates.has(oldHistory.date)) {
                            funnel.history.push(
                                funnelHistoryRepository.create({
                                    date: oldHistory.date,
                                    open_count: oldHistory.open_count,
                                    cart_count: oldHistory.cart_count,
                                    order_count: oldHistory.order_count,
                                    order_sum: oldHistory.order_sum,
                                    buyout_count: oldHistory.buyout_count,
                                    buyout_sum: oldHistory.buyout_sum,
                                    buyout_percent: oldHistory.buyout_percent,
                                    add_to_cart_conversion: oldHistory.add_to_cart_conversion,
                                    cart_to_order_conversion: oldHistory.cart_to_order_conversion,
                                    add_to_wishlist_count: oldHistory.add_to_wishlist_count
                                })
                            );
                        }
                    }
                }

                funnelsToSave.forEach(funnel => newFunnelsNmIds.add(funnel.nm_id));
                await funnelRepository.save(funnelsToSave, { chunk: 100 });
                this.logger.log(`Чанк из ${funnelsToSave.length} воронок записан (snapshot ${snapshot.id})`);
            }

            await this.dataSource.transaction(async (manager: EntityManager) => {
                const oldSnapshot = await this.syncSnapshotsService.getActive(dataSourceId, SyncScope.Funnel);
                
                if (oldSnapshot) {
                    await this.syncSnapshotsService.archive(manager, oldSnapshot.id);
                }

                await this.cleanupFunnel(manager, {
                    datasourceId: dataSourceId,
                    snapshotId: snapshot.id,
                    nmIds: Array.from(newFunnelsNmIds)
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
            this.logger.error('Ошибка при синхронизации WB воронок!', error);
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

        return this.dataSource.getRepository(WbFunnelEntity).find({
            where: {
                datasource_id: dataSourceId,
                snapshot_id: excludeSnapshots(snapshotsIds)
            },
            relations: {
                history: true
            }
        })
    }
}
