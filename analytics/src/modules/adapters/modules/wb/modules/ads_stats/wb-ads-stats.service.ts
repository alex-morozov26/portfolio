import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import axios from 'axios';
import { WbAdsStatEntity } from './entities/wb-ads-stat.entity';
import { WbAdsCampaignEntity } from '../ads_campaigns/entities/wb-ads-campaign.entity';
import { WbAdsStatBoosterEntity } from './entities/wb-ads-stat-booster.entity';
import { WbAdsStatDayEntity } from './entities/wb-ads-stat-day.entity';
import { WbAdsStatDayAppEntity } from './entities/wb-ads-stat-day-app.entity';
import { WbAdsStatDayAppNmEntity } from './entities/wb-ads-stat-day-app-nm.entity';
import { sleep } from 'src/utils/sleep';
import { SyncSnapshotsService } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.service';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { chunkArray } from 'src/utils/chunk-array';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { SyncResult } from 'src/modules/sync/modules/sync-snapshots/models/sync-result.interface';
import { WbAdsStatsCleanupOptions } from './models/ads-stats-cleanup-options.interface';
import { excludeSnapshots } from 'src/utils/exclude-snapshots';

@Injectable()
export class WbAdsStatsService {
    private readonly logger = new Logger(WbAdsStatsService.name);
    private readonly apiUrl = 'https://advert-api.wildberries.ru/adv/v3/fullstats';

    constructor(
        private readonly dataSource: DataSource,
        private readonly syncSnapshotsService: SyncSnapshotsService
    ) { }

    private async *streamAdsStats(apiToken: string, dataSourceId: string) {
        const chunkSize = 50;
        const dateRange = this.getDateRange();
        const snapshot = await this.syncSnapshotsService.getActive(dataSourceId, SyncScope.AdsCampaigns);
        if (!snapshot) {
            yield [];
            return;
        }
        const adverts = await this.dataSource
            .getRepository(WbAdsCampaignEntity)
            .find({
                select: {
                    advert_id: true
                },
                where: {
                    datasource_id: dataSourceId,
                    snapshot_id: snapshot.id
                }
            });
        const advertsIds = adverts.map(advert => advert.advert_id);
        const chunks = chunkArray<number>(advertsIds, chunkSize);
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];

            const { data } = await axios.get(this.apiUrl, {
                headers: {
                    Authorization: apiToken,
                    'Content-Type': 'application/json',
                },
                params: {
                    ids: chunk.join(','),
                    beginDate: dateRange.beginDate,
                    endDate: dateRange.endDate
                }
            });

            const adsStats = data ?? [];

            yield adsStats;

            if (i < chunks.length - 1) {
                await sleep(20000);
            }
        }
    }

    private getDateRange() {
        const endDate = new Date();
        const beginDate = new Date(endDate);
        beginDate.setDate(endDate.getDate() - 30);
        
        return {
            beginDate: beginDate.toISOString().slice(0, 10),
            endDate: endDate.toISOString().slice(0, 10)
        };
    }

    private mapToEntity(manager: EntityManager, dataSourceId: string, snapshotId: string, adsStat: any): WbAdsStatEntity {
        return manager.create(WbAdsStatEntity, {
            datasource_id: dataSourceId,
            snapshot_id: snapshotId,
            advert_id: adsStat.advertId,
            atbs: adsStat.atbs,
            canceled: adsStat.canceled,
            clicks: adsStat.clicks,
            cpc: adsStat.cpc,
            cr: adsStat.cr,
            ctr: adsStat.ctr,
            orders: adsStat.orders,
            shks: adsStat.shks,
            sum: adsStat.sum,
            sum_price: adsStat.sum_price,
            views: adsStat.views,
            booster_stats: (adsStat.boosterStats || []).map(booster =>
                manager.create(WbAdsStatBoosterEntity, {
                    avg_position: booster.avg_position,
                    date: booster.date,
                    nm: booster.nm
                })
            ),
            days: (adsStat.days || []).map(day => 
                manager.create(WbAdsStatDayEntity, {
                    atbs: day.atbs,
                    canceled: day.canceled,
                    clicks: day.clicks,
                    cpc: day.cpc,
                    cr: day.cr,
                    ctr: day.ctr,
                    orders: day.orders,
                    shks: day.shks,
                    sum: day.sum,
                    sum_price: day.sum_price,
                    views: day.views,
                    date: new Date(day.date),
                    apps: (day.apps || []).map(app =>
                        manager.create(WbAdsStatDayAppEntity, {
                            app_type: app.appType,
                            atbs: app.atbs,
                            canceled: app.canceled,
                            clicks: app.clicks,
                            cpc: app.cpc,
                            cr: app.cr,
                            ctr: app.ctr,
                            orders: app.orders,
                            shks: app.shks,
                            sum: app.sum,
                            sum_price: app.sum_price,
                            views: app.views,
                            nms: (app.nms || []).map(nm =>
                                manager.create(WbAdsStatDayAppNmEntity, {
                                    name: nm.name,
                                    nm_id: nm.nmId,
                                    atbs: nm.atbs,
                                    canceled: nm.canceled,
                                    clicks: nm.clicks,
                                    cpc: nm.cpc,
                                    cr: nm.cr,
                                    ctr: nm.ctr,
                                    orders: nm.orders,
                                    shks: nm.shks,
                                    sum: nm.sum,
                                    sum_price: nm.sum_price,
                                    views: nm.views,
                                })
                            )
                        })
                    )
                })
            )
        });
    }

    private async cleanupAdsStats(manager: EntityManager, options: WbAdsStatsCleanupOptions) {
        const chunkSize = 300;

        if (options.snapshotId && options.advertIds && options.advertIds.length > 0) {
            const chunks = chunkArray<number>(options.advertIds, chunkSize);
            for (const chunk of chunks) {
                await manager.getRepository(WbAdsStatEntity).delete({
                    datasource_id: options.datasourceId,
                    snapshot_id: Not(options.snapshotId),
                    advert_id: In(chunk)
                });
            }
        } else if (options.snapshotId) {
            await manager.getRepository(WbAdsStatEntity).delete({
                datasource_id: options.datasourceId,
                snapshot_id: options.snapshotId
            });
        }
    }

    async syncAdsStats(apiToken: string, dataSourceId: string, mode: SyncMode): Promise<SyncResult> {
        const manager = this.dataSource.manager;
        const snapshot = await this.syncSnapshotsService.create(dataSourceId, SyncScope.AdsStats, mode);
        const adsStatsRepository = this.dataSource.getRepository(WbAdsStatEntity);
        const adsStatDaysRepository = this.dataSource.getRepository(WbAdsStatDayEntity);
        const snapshotsInProgress = await this.syncSnapshotsService.getLoading(dataSourceId, SyncScope.AdsStats);
        const snapshotsIds = snapshotsInProgress.map(snapshot => snapshot.id);
        
        try {
            const newAdsStatsAdvertsIds = new Set<number>();

            for await (const adsStats of this.streamAdsStats(apiToken, dataSourceId)) {
                const adsStatsToSave = adsStats.map(adsStat => this.mapToEntity(
                    manager, dataSourceId, snapshot.id, adsStat
                ));

                const oldAdsStats = await this.dataSource.getRepository(WbAdsStatEntity).find({
                    where: {
                        datasource_id: dataSourceId,
                        snapshot_id: excludeSnapshots(snapshotsIds),
                        advert_id: In(adsStatsToSave.map(adsStat => adsStat.advert_id))
                    },
                    relations: {
                        days: {
                            apps: {
                                nms: true
                            }
                        }
                    }
                })
                const oldMap = new Map(oldAdsStats.map(s => [s.advert_id, s]));

                for (const adsStat of adsStatsToSave) {
                    const oldAdsStat = oldMap.get(adsStat.advert_id);
                    if (!oldAdsStat) continue;

                    const newDates = new Set(adsStat.days.map(d => d.date.toISOString()));

                    for (const oldDay of oldAdsStat.days) {
                        if (!newDates.has(oldDay.date.toISOString())) {
                            adsStat.days.push(
                                adsStatDaysRepository.create({
                                    atbs: oldDay.atbs,
                                    canceled: oldDay.canceled,
                                    clicks: oldDay.clicks,
                                    cpc: oldDay.cpc,
                                    cr: oldDay.cr,
                                    ctr: oldDay.ctr,
                                    orders: oldDay.orders,
                                    shks: oldDay.shks,
                                    sum: oldDay.sum,
                                    sum_price: oldDay.sum_price,
                                    views: oldDay.views,
                                    date: new Date(oldDay.date),
                                    apps: oldDay.apps.map(app =>
                                        manager.create(WbAdsStatDayAppEntity, {
                                            app_type: app.app_type,
                                            atbs: app.atbs,
                                            canceled: app.canceled,
                                            clicks: app.clicks,
                                            cpc: app.cpc,
                                            cr: app.cr,
                                            ctr: app.ctr,
                                            orders: app.orders,
                                            shks: app.shks,
                                            sum: app.sum,
                                            sum_price: app.sum_price,
                                            views: app.views,
                                            nms: app.nms.map(nm =>
                                                manager.create(WbAdsStatDayAppNmEntity, {
                                                    name: nm.name,
                                                    nm_id: nm.nm_id,
                                                    atbs: nm.atbs,
                                                    canceled: nm.canceled,
                                                    clicks: nm.clicks,
                                                    cpc: nm.cpc,
                                                    cr: nm.cr,
                                                    ctr: nm.ctr,
                                                    orders: nm.orders,
                                                    shks: nm.shks,
                                                    sum: nm.sum,
                                                    sum_price: nm.sum_price,
                                                    views: nm.views,
                                                })
                                            )
                                        })
                                    )
                                })
                            )
                        }
                    }
                }

                adsStatsToSave.forEach(adsStat => newAdsStatsAdvertsIds.add(adsStat.advert_id));
                await adsStatsRepository.save(adsStatsToSave, { chunk: 5 });
                this.logger.log(`Чанк из ${adsStatsToSave.length} статистик по рекламе записан (snapshot ${snapshot.id})`);
            }

            await this.dataSource.transaction(async (manager: EntityManager) => {
                const oldSnapshot = await this.syncSnapshotsService.getActive(dataSourceId, SyncScope.AdsStats);
                
                if (oldSnapshot) {
                    await this.syncSnapshotsService.archive(manager, oldSnapshot.id);
                }

                await this.cleanupAdsStats(manager, {
                    datasourceId: dataSourceId,
                    snapshotId: snapshot.id,
                    advertIds: Array.from(newAdsStatsAdvertsIds)
                })

                await this.syncSnapshotsService.activate(manager, snapshot.id);
            });

            return {
                snapshotId: snapshot.id,
                success: true
            }
        } catch (error) {
            await this.cleanupAdsStats(manager, {
                datasourceId: dataSourceId,
                snapshotId: snapshot.id
            })
            await this.syncSnapshotsService.fail(snapshot.id);
            this.logger.error('Ошибка при синхронизации статистики по рекламе WB!', error);
            return {
                snapshotId: snapshot.id,
                success: false,
                error: `Ошибка при синхронизации статистики по рекламе: ${error?.message || 'Неизвестная ошибка'}`
            }
        }
    }

    async getAllAdsStats(dataSourceId: string) {
        const snapshotsInProgress = await this.syncSnapshotsService.getLoading(dataSourceId, SyncScope.AdsStats);
        const snapshotsIds = snapshotsInProgress.map(s => s.id);
        const snapshotsCriteria = excludeSnapshots(snapshotsIds);

        const repository = this.dataSource.getRepository(WbAdsStatEntity);
        const limit = 10;
        const offset = 0;

        const [stats, total] = await Promise.all([
            repository.find({
                where: {
                    datasource_id: dataSourceId,
                    snapshot_id: snapshotsCriteria
                },
                relations: {
                    booster_stats: true,
                    days: {
                        apps: {
                            nms: true
                        }
                    }
                },
                take: limit,
                skip: offset
            }),
            repository.count({
                where: {
                    datasource_id: dataSourceId,
                    snapshot_id: snapshotsCriteria
                }
            })
        ])

        return { 
            results: stats,
            count: total,
            offset: offset,
            limit: limit
        };  
    }
}
