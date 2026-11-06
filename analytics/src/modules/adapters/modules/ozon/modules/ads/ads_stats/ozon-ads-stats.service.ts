import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import axios from 'axios';
import { OzonAdsCampaignEntity } from '../ads_campaigns/entities/ozon-ads-campaign.entity';
import { OzonAdsService } from '../ozon-ads.service';
import { OzonAdsStatEntity } from './entities/ozon-ads-stat.entity';
import { OzonAdsStatRowEntity } from './entities/ozon-ads-stat-row.entity';
import { sleep } from 'src/utils/sleep';
import { SyncSnapshotsService } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.service';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { chunkArray } from 'src/utils/chunk-array';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { SyncResult } from 'src/modules/sync/modules/sync-snapshots/models/sync-result.interface';
import { OzonAdsStatsCleanupOptions } from './models/ads-stats-cleanup-options.interface';
import { excludeSnapshots } from 'src/utils/exclude-snapshots';

@Injectable()
export class OzonAdsStatsService {
    private readonly logger = new Logger(OzonAdsStatsService.name);
    private readonly requestReportUrl = 'https://api-performance.ozon.ru:443/api/client/statistics/json';
    private readonly getReportUrl = 'https://api-performance.ozon.ru:443/api/client/statistics/report';    
    private checkReportUrl(uuid: string): string {
        return `https://api-performance.ozon.ru:443/api/client/statistics/${uuid}`;
    }

    constructor(
        private readonly dataSource: DataSource,
        private readonly ozonAdsService: OzonAdsService,
        private readonly syncSnapshotsService: SyncSnapshotsService
    ) { }

    private async *streamAdsStats(clientId: string, clientSecret: string, dataSourceId: string) {
        const snapshot = await this.syncSnapshotsService.getActive(dataSourceId, SyncScope.AdsCampaigns);
        if (!snapshot) {
            yield [];
            return;
        }

        const campaigns = await this.dataSource.getRepository(OzonAdsCampaignEntity).find({
            select: {
                campaign_id: true
            },
            where: {
                datasource_id: dataSourceId,
                snapshot_id: snapshot.id
            }
        })

        const chunkSize = 10;
        const campaignsIds = campaigns.map(campaign => campaign.campaign_id);
        const { dateFrom, dateTo } = this.getDateRange();

        const chunks = chunkArray<string>(campaignsIds, chunkSize);

        for (const chunk of chunks) {
            const { uuid, vendor } = await this.requestChunkReport(
                chunk, dateFrom, dateTo,
                clientId, clientSecret, dataSourceId
            );
            await this.waitReport(uuid, vendor, clientId, clientSecret, dataSourceId);
            const chunkReport = await this.getReport(uuid, clientId, clientSecret, dataSourceId);
            const chunkReportKeys = Object.keys(chunkReport)
            const adsStats = chunkReportKeys.map(key => {
                let adsStat = chunkReport[key];
                adsStat.campaign_id = key;
                return adsStat;
            })

            yield adsStats;
        }
    }

    private async requestChunkReport(
        campaignsIds: string[], dateFrom: string, dateTo: string,
        clientId: string, clientSecret: string, dataSourceId: string
    ) {
        try {
            const token = await this.ozonAdsService.getPerformanceToken(clientId, clientSecret, dataSourceId);
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }

            const payload = {
                campaigns: campaignsIds,
                dateFrom: dateFrom,
                dateTo: dateTo
            }

            const { data } = await axios.post(this.requestReportUrl, payload, options);

            return { uuid: data.UUID, vendor: data.vendor };
        } catch (error) {
            throw error;
        }
    }

    private async waitReport(uuid: string, vendor: boolean, clientId: string, clientSecret: string, dataSourceId: string) {
        for (let i = 0; i < 30; i++) {
            await sleep(20000);
            const token = await this.ozonAdsService.getPerformanceToken(clientId, clientSecret, dataSourceId);

            try {
                const { data } = await axios.get(this.checkReportUrl(uuid), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    params: { vendor }
                });

                if (data.state === 'OK') return;
            } catch (error) {
                if (error.response?.status === 404) {
                    continue;
                }
                throw error;
            }
        }
        throw new Error('Отчет со статистикой по рекламе Ozon не сформировался!');
    }

    private async getReport(uuid: string, clientId: string, clientSecret: string, dataSourceId: string) {
        const token = await this.ozonAdsService.getPerformanceToken(clientId, clientSecret, dataSourceId);

        try {
            const { data } = await axios.get(this.getReportUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                params: {
                    UUID: uuid
                }
            })

            return data;
        } catch (error) {
            throw error;
        }
    }

    private getDateRange() {
        const dateTo = new Date();
        const dateFrom = new Date(dateTo);
        dateFrom.setDate(dateTo.getDate() - 61);
        
        return {
            dateFrom: dateFrom.toISOString().slice(0, 10),
            dateTo: dateTo.toISOString().slice(0, 10)
        };
    }

    private mapToEntity(manager: EntityManager, dataSourceId: string, snapshotId: string, adsStat: any): OzonAdsStatEntity {
        return manager.create(OzonAdsStatEntity, {
            datasource_id: dataSourceId,
            snapshot_id: snapshotId,
            campaign_id: adsStat.campaign_id,
            title: adsStat.title ?? null,
            total_search_query: adsStat.report?.totals?.search_query ?? null,
            total_views: adsStat.report?.totals?.views ?? null,
            total_clicks: adsStat.report?.totals?.clicks ?? null,
            total_ctr: adsStat.report?.totals?.ctr ?? null,
            total_to_cart: adsStat.report?.totals?.toCart ?? null,
            total_avg_bid: adsStat.report?.totals?.avgBid ?? null,
            total_money_spent: adsStat.report?.totals?.moneySpent ?? null,
            total_orders: adsStat.report?.totals?.orders ?? null,
            total_orders_money: adsStat.report?.totals?.ordersMoney ?? null,
            total_models: adsStat.report?.totals?.models ?? null,
            total_models_money: adsStat.report?.totals?.modelsMoney ?? null,
            total_ddr: adsStat.report?.totals?.drr ?? null,
            rows: (adsStat.report?.rows ?? []).filter(row => !!row.createdAt).map(row =>
                manager.create(OzonAdsStatRowEntity, {
                    sku: row.sku || null,
                    title: row.title ?? null,
                    price: row.price ?? null,
                    search_query: row.search_query ?? null,
                    views: row.views ?? null,
                    clicks: row.clicks ?? null,
                    ctr: row.ctr ?? null,
                    to_cart: row.toCart ?? null,
                    avg_bid: row.avgBid ?? null,
                    money_spent: row.moneySpent ?? null,
                    orders: row.orders ?? null,
                    orders_money: row.ordersMoney ?? null,
                    models: row.models ?? null,
                    models_money: row.modelsMoney ?? null,
                    ddr: row.drr ?? null,
                    created_at: row.createdAt
                })
            )
        });
    }

    private async cleanupAdsStats(manager: EntityManager, options: OzonAdsStatsCleanupOptions) {
        const chunkSize = 300;

        if (options.snapshotId && options.campaignIds && options.campaignIds.length > 0) {
            const chunks = chunkArray<string>(options.campaignIds, chunkSize);
            for (const chunk of chunks) {
                await manager.getRepository(OzonAdsStatEntity).delete({
                    datasource_id: options.datasourceId,
                    snapshot_id: Not(options.snapshotId),
                    campaign_id: In(chunk)
                });
            }
        } else if (options.snapshotId) {
            await manager.getRepository(OzonAdsStatEntity).delete({
                datasource_id: options.datasourceId,
                snapshot_id: options.snapshotId
            });
        }
    }

    async syncAdsStats(clientId: string, clientSecret: string, dataSourceId: string, mode: SyncMode): Promise<SyncResult> {
        const manager = this.dataSource.manager;
        const snapshot = await this.syncSnapshotsService.create(dataSourceId, SyncScope.AdsStats, mode);
        const adsStatsRepository = this.dataSource.getRepository(OzonAdsStatEntity);
        const adsStatRowsRepository = this.dataSource.getRepository(OzonAdsStatRowEntity);
        const snapshotsInProgress = await this.syncSnapshotsService.getLoading(dataSourceId, SyncScope.AdsStats);
        const snapshotsIds = snapshotsInProgress.map(snapshot => snapshot.id);

        try {
            const newAdsStatsCampaignIds = new Set<string>();

            for await (const adsStats of this.streamAdsStats(clientId, clientSecret, dataSourceId)) {
                const adsStatsToSave = adsStats.map(adsStat => this.mapToEntity(
                    manager, dataSourceId, snapshot.id, adsStat
                ))

                const oldAdsStats = await adsStatsRepository.find({
                    where: {
                        datasource_id: dataSourceId,
                        snapshot_id: excludeSnapshots(snapshotsIds),
                        campaign_id: In(adsStatsToSave.map(adsStat => adsStat.campaign_id))
                    },
                    relations: {
                        rows: true
                    }
                })
                const oldMap = new Map(oldAdsStats.map(s => [s.campaign_id, s]));

                for (const adsStat of adsStatsToSave) {
                    const oldAdsStat = oldMap.get(adsStat.campaign_id.toString());
                    if (!oldAdsStat) continue;

                    const newDates = new Set(adsStat.rows.map(r => r.created_at));

                    for (const oldRow of oldAdsStat.rows) {
                        if (!newDates.has(oldRow.created_at)) {
                            adsStat.rows.push(
                                adsStatRowsRepository.create({
                                    sku: oldRow.sku,
                                    title: oldRow.title,
                                    price: oldRow.price,
                                    search_query: oldRow.search_query,
                                    views: oldRow.views,
                                    clicks: oldRow.clicks,
                                    ctr: oldRow.ctr,
                                    to_cart: oldRow.to_cart,
                                    avg_bid: oldRow.avg_bid,
                                    money_spent: oldRow.money_spent,
                                    orders: oldRow.orders,
                                    orders_money: oldRow.orders_money,
                                    models: oldRow.models,
                                    models_money: oldRow.models_money,
                                    ddr: oldRow.ddr,
                                    created_at: oldRow.created_at
                                })
                            )
                        }
                    }
                }

                adsStatsToSave.forEach(adsStat => newAdsStatsCampaignIds.add(adsStat.campaign_id));
                await adsStatsRepository.save(adsStatsToSave, { chunk: 100 })
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
                    campaignIds: Array.from(newAdsStatsCampaignIds)
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
            this.logger.error('Ошибка при синхронизации статистики по рекламе Ozon!', error);
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

        return this.dataSource.getRepository(OzonAdsStatEntity).find({
            where: {
                datasource_id: dataSourceId,
                snapshot_id: excludeSnapshots(snapshotsIds)
            },
            relations: {
                rows: true
            }
        })
    }
}
