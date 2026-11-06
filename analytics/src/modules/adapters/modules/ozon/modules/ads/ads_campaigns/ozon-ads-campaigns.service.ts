import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import axios from 'axios';
import { OzonAdsService } from '../ozon-ads.service';
import { OzonAdsCampaignEntity } from './entities/ozon-ads-campaign.entity';
import { SyncSnapshotsService } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.service';
import { chunkArray } from 'src/utils/chunk-array';
import { sleep } from 'src/utils/sleep';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { SyncResult } from 'src/modules/sync/modules/sync-snapshots/models/sync-result.interface';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { OzonAdsCampaignsCleanupOptions } from './models/ads-campaigns-cleanup-options.interface';
import { excludeSnapshots } from 'src/utils/exclude-snapshots';

@Injectable()
export class OzonAdsCampaignsService {
    private readonly logger = new Logger(OzonAdsCampaignsService.name);
    private readonly apiUrl = 'https://api-performance.ozon.ru:443/api/client/campaign';

    constructor(
        private readonly ozonAdsService: OzonAdsService,
        private readonly dataSource: DataSource,
        private readonly syncSnapshotsService: SyncSnapshotsService
    ) { }

    private async *streamAdsCampaigns(clientId: string, clientSecret: string, dataSourceId: string) {
        const chunkSize = 100;
        const token = await this.ozonAdsService.getPerformanceToken(clientId, clientSecret, dataSourceId);

        const { data } = await axios.get(this.apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const adsCampaigns = data.list || [];

        const chunks = chunkArray(adsCampaigns, chunkSize);

        for (const chunk of chunks) {
            yield chunk;
            await sleep(500);
        }
    }

    private mapToEntity(manager: EntityManager, dataSourceId: string, snapshotId: string, adsCampaign: any): OzonAdsCampaignEntity {
        return manager.create(OzonAdsCampaignEntity, {
            datasource_id: dataSourceId,
            snapshot_id: snapshotId,
            campaign_id: adsCampaign.id,
            payment_type: adsCampaign.PaymentType,
            title: adsCampaign.title,
            state: adsCampaign.state,
            adv_object_type: adsCampaign.advObjectType,
            from_date: adsCampaign.fromDate ? adsCampaign.fromDate : null,
            to_date: adsCampaign.toDate ? adsCampaign.toDate : null,
            autostop_status: adsCampaign.autostopStatus,
            is_autocreated: adsCampaign.isAutocreated,
            budget: adsCampaign.budget,
            daily_budget: adsCampaign.dailyBudget,
            weekly_budget: adsCampaign.weeklyBudget,
            placement: adsCampaign.placement,
            product_autopilot_strategy: adsCampaign.productAutopilotStrategy,
            autopilot_category_id: adsCampaign.autopilot?.categoryId ?? null,
            autopilot_sku_add_mode: adsCampaign.autopilot?.skuAddMode ?? null,
            created_at: new Date(adsCampaign.createdAt),
            updated_at: new Date(adsCampaign.updatedAt),
            product_campaign_mode: adsCampaign.productCampaignMode
        })
    }

    private async cleanupAdsCampaigns(manager: EntityManager, options: OzonAdsCampaignsCleanupOptions) {
        const chunkSize = 300;

        if (options.snapshotId && options.campaignIds && options.campaignIds.length > 0) {
            const chunks = chunkArray<string>(options.campaignIds, chunkSize);
            for (const chunk of chunks) {
                await manager.getRepository(OzonAdsCampaignEntity).delete({
                    datasource_id: options.datasourceId,
                    snapshot_id: Not(options.snapshotId),
                    campaign_id: In(chunk)
                });
            }
        } else if (options.snapshotId) {
            await manager.getRepository(OzonAdsCampaignEntity).delete({
                datasource_id: options.datasourceId,
                snapshot_id: options.snapshotId
            });
        }
    }

    async syncAdsCampaigns(clientId: string, clientSecret: string, dataSourceId: string, mode: SyncMode): Promise<SyncResult> {
        const manager = this.dataSource.manager;
        const snapshot = await this.syncSnapshotsService.create(dataSourceId, SyncScope.AdsCampaigns, mode);
        const adsCampaignsRepository = this.dataSource.getRepository(OzonAdsCampaignEntity);
        
        try {
            const newAdsCampaignsCampaignIds = new Set<string>();

            for await (const adsCampaigns of this.streamAdsCampaigns(clientId, clientSecret, dataSourceId)) {
                const adsCampaignsToSave = adsCampaigns.map(adsCampaign => this.mapToEntity(
                    manager, dataSourceId, snapshot.id, adsCampaign
                ))
                adsCampaignsToSave.forEach(adsCampaign => newAdsCampaignsCampaignIds.add(adsCampaign.campaign_id));
                await adsCampaignsRepository.save(adsCampaignsToSave, { chunk: 100 });
                this.logger.log(`Чанк из ${adsCampaignsToSave.length} рекламных кампаний записан (snapshot ${snapshot.id})`);
            }

            await this.dataSource.transaction(async (manager: EntityManager) => {
                const oldSnapshot = await this.syncSnapshotsService.getActive(dataSourceId, SyncScope.AdsCampaigns);
                
                if (oldSnapshot) {
                    await this.syncSnapshotsService.archive(manager, oldSnapshot.id);
                }

                await this.cleanupAdsCampaigns(manager, {
                    datasourceId: dataSourceId,
                    snapshotId: snapshot.id,
                    campaignIds: Array.from(newAdsCampaignsCampaignIds)
                })

                await this.syncSnapshotsService.activate(manager, snapshot.id);
            });

            return {
                snapshotId: snapshot.id,
                success: true
            }
        } catch (error) {
            await this.cleanupAdsCampaigns(manager, {
                datasourceId: dataSourceId,
                snapshotId: snapshot.id
            })
            await this.syncSnapshotsService.fail(snapshot.id);
            this.logger.error('Ошибка при синхронизации списка рекламных кампаний Ozon!', error);
            return {
                snapshotId: snapshot.id,
                success: false,
                error: `Ошибка при синхронизации списка рекламных кампаний: ${error?.message || 'Неизвестная ошибка'}`
            }
        }
    }

    async getAllAdsCampaigns(dataSourceId: string) {
        const snapshotsInProgress = await this.syncSnapshotsService.getLoading(dataSourceId, SyncScope.AdsCampaigns);
        const snapshotsIds = snapshotsInProgress.map(s => s.id);

        return this.dataSource.getRepository(OzonAdsCampaignEntity).find({
            where: {
                datasource_id: dataSourceId,
                snapshot_id: excludeSnapshots(snapshotsIds)
            }
        })
    }
}
