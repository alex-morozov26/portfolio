import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import axios from 'axios';
import { WbAdsCampaignEntity } from './entities/wb-ads-campaign.entity';
import { sleep } from 'src/utils/sleep';
import { SyncSnapshotsService } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.service';
import { chunkArray } from 'src/utils/chunk-array';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { SyncResult } from 'src/modules/sync/modules/sync-snapshots/models/sync-result.interface';
import { WbAdsCampaignsCleanupOptions } from './models/ads-campaigns-cleanup-options.interface';
import { excludeSnapshots } from 'src/utils/exclude-snapshots';

@Injectable()
export class WbAdsCampaignsService {
    private readonly logger = new Logger(WbAdsCampaignsService.name);
    private readonly apiCountUrl = 'https://advert-api.wildberries.ru/adv/v1/promotion/count';
    private readonly apiDetailUrl = 'https://advert-api.wildberries.ru/adv/v1/promotion/adverts';

    constructor(
        private readonly dataSource: DataSource,
        private readonly syncSnapshotsService: SyncSnapshotsService
    ) { }

    private async *streamAdsCampaigns(apiToken: string) {
        const chunkSize = 50;

        const options = {
            headers: {
                Authorization: apiToken,
                'Content-Type': 'application/json',
            }
        }

        const { data } = await axios.get(this.apiCountUrl, options);

        const advertsIds = data.adverts.map(advertGroup => {
            return advertGroup.advert_list.map(advert => advert.advertId);
        }).flat();

        const chunks = chunkArray<number>(advertsIds, chunkSize);

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];

            const { data } = await axios.post(this.apiDetailUrl, chunk, options);
            const adsCampaigns = data ?? [];

            yield adsCampaigns;

            if (i < chunks.length - 1) {
                await sleep(500);
            }
        }
    }

    private mapToEntity(manager: EntityManager, dataSourceId: string, snapshotId: string, adsCampaign: any): WbAdsCampaignEntity {
        return manager.create(WbAdsCampaignEntity, {
            datasource_id: dataSourceId,
            snapshot_id: snapshotId,
            end_time: adsCampaign.endTime ? new Date(adsCampaign.endTime) : null,
            create_time: new Date(adsCampaign.createTime),
            change_time: adsCampaign.changeTime ? new Date(adsCampaign.changeTime) : null,
            start_time: adsCampaign.startTime ? new Date(adsCampaign.startTime) : null,
            advert_id: adsCampaign.advertId,
            name: adsCampaign.name,
            status: adsCampaign.status ?? null,
            type: adsCampaign.type ?? null,
            payment_type: adsCampaign.paymentType ?? null,
            bid_type: adsCampaign.bid_type ?? null
        })
    }

    private async cleanupAdsCampaigns(manager: EntityManager, options: WbAdsCampaignsCleanupOptions) {
        const chunkSize = 300;

        if (options.snapshotId && options.advertIds && options.advertIds.length > 0) {
            const chunks = chunkArray<number>(options.advertIds, chunkSize);
            for (const chunk of chunks) {
                await manager.getRepository(WbAdsCampaignEntity).delete({
                    datasource_id: options.datasourceId,
                    snapshot_id: Not(options.snapshotId),
                    advert_id: In(chunk)
                });
            }
        } else if (options.snapshotId) {
            await manager.getRepository(WbAdsCampaignEntity).delete({
                datasource_id: options.datasourceId,
                snapshot_id: options.snapshotId
            });
        }
    }

    async syncAdsCampaigns(apiToken: string, dataSourceId: string, mode: SyncMode): Promise<SyncResult> {
        const manager = this.dataSource.manager;
        const snapshot = await this.syncSnapshotsService.create(dataSourceId, SyncScope.AdsCampaigns, mode);
        const adsCampaignsRepository = this.dataSource.getRepository(WbAdsCampaignEntity);

        try {
            const newAdsCampaignsAdvertsIds = new Set<number>()

            for await (const adsCampaigns of this.streamAdsCampaigns(apiToken)) {
                const adsCampaignsToSave = adsCampaigns.map(adsCampaign => this.mapToEntity(
                    manager, dataSourceId, snapshot.id, adsCampaign
                ))
                adsCampaignsToSave.forEach(adsCampaign => {
                    newAdsCampaignsAdvertsIds.add(adsCampaign.advert_id)
                });
                await adsCampaignsRepository.save(adsCampaignsToSave, { chunk: 100 })
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
                    advertIds: Array.from(newAdsCampaignsAdvertsIds)
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
            this.logger.error('Ошибка при синхронизации списка рекламных кампаний WB!', error);
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

        return this.dataSource.getRepository(WbAdsCampaignEntity).find({
            where: {
                datasource_id: dataSourceId,
                snapshot_id: excludeSnapshots(snapshotsIds)
            }
        })
    }
}
