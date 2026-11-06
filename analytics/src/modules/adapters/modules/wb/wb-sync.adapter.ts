import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CredentialsService } from 'src/modules/credentials/credentials.service';
import { SyncAdapterInterface } from '../../models/sync-adapter.interface';
import { WbProductsService } from './modules/products/wb-products.service';
import { WbPricesService } from './modules/prices/wb-prices.service';
import { WbOrdersService } from './modules/orders/wb-orders.service';
import { WbFunnelService } from './modules/funnel/wb-funnel.service';
import { WbStocksService } from './modules/stocks/wb-stocks.service';
import { WbAdsCampaignsService } from './modules/ads_campaigns/wb-ads-campaigns.service';
import { WbAdsStatsService } from './modules/ads_stats/wb-ads-stats.service';
import { SyncMode } from '../../models/sync-mode.enum';
import { SyncLogsService } from 'src/modules/sync/modules/sync-logs/sync-logs.service';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { DataSourceType } from 'src/modules/data-sources/models/data-source-type.enum';
import { SyncError } from 'src/modules/sync/modules/sync-logs/models/sync-error.interface';
import { SyncMetaService } from 'src/modules/sync/modules/sync-meta/sync-meta.service';
import { SyncSnapshotsService } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.service';
import { WbSyncMultyStep, WbSyncStep } from './models/wb-sync-step.type';

@Injectable()
export class WbSyncAdapter implements SyncAdapterInterface {

    constructor (
        private readonly credentialsService: CredentialsService,
        private readonly syncLogsService: SyncLogsService,
        private readonly syncMetaService: SyncMetaService,
        private readonly syncSnapshotsService: SyncSnapshotsService,
        private readonly wbProductsService: WbProductsService,
        private readonly wbPricesService: WbPricesService,
        private readonly wbOrdersService: WbOrdersService,
        private readonly wbFunnelService: WbFunnelService,
        private readonly wbStocksService: WbStocksService,
        private readonly wbAdsCampaignsService: WbAdsCampaignsService,
        private readonly wbAdsStatsService: WbAdsStatsService
    ) {}

    private async getApiToken(dataSourceId: string): Promise<string> {
        const credentials = await this.credentialsService.getCredentials(dataSourceId);
        const apiToken = credentials.wb_api_token;

        if (!apiToken) {
            throw new Error('Данные для доступа к Wb API не найдены!')
        }

        return apiToken;
    }

    private async runSingle(
        scope: SyncScope,
        dataSourceId: string,
        step: WbSyncStep,
        mode: SyncMode
    ) {
        const log = await this.syncLogsService.start(scope, dataSourceId, DataSourceType.Wb, mode);

        let apiToken: string;

        try {
            apiToken = await this.getApiToken(dataSourceId);
        } catch (error) {
            const errors = [
                {
                    scope: scope,
                    message: error?.message ?? 'Ошибка получения API токена!',
                }
            ]
            await this.syncLogsService.fail(log.id, [], errors);
            throw new InternalServerErrorException({ message: 'Синхронизация завершилась с ошибками!', errors });
        }

        const result = await step(apiToken);
        if (result.success) {
            const finishedAt = await this.syncLogsService.success(log.id, [result.snapshotId]);
            await this.syncMetaService.updateScopeSync(dataSourceId, scope, finishedAt);
        } else {
            const errors = [{ scope, message: result.error ?? 'Неизвестная ошибка' }]
            await this.syncLogsService.fail(log.id, [result.snapshotId], errors);
            throw new InternalServerErrorException({ message: 'Синхронизация завершилась с ошибками!', errors });
        }
    }

    private async runMulty(
        scope: SyncScope,
        dataSourceId: string,
        steps: WbSyncMultyStep[],
        mode: SyncMode
    ) {
        const log = await this.syncLogsService.start(scope, dataSourceId, DataSourceType.Wb, mode);

        let apiToken: string;

        try {
            apiToken = await this.getApiToken(dataSourceId);
        } catch (error) {
            const errors = [
                {
                    scope: scope,
                    message: error?.message ?? 'Ошибка получения API токена',
                }
            ]
            await this.syncLogsService.fail(log.id, [], errors);
            throw new InternalServerErrorException({ message: 'Синхронизация завершилась с ошибками!', errors });
        }

        const errors: SyncError[] = []
        const snapshots: string[] = []

        for (const [stepScope, step] of steps) {
            const result = await step(apiToken);
            if (result.success) {
                await this.syncMetaService.updateScopeSync(dataSourceId, stepScope, new Date());
            } else {
                errors.push({ scope: stepScope, message: result.error ?? 'Неизвестная ошибка' })
            }
            snapshots.push(result.snapshotId);
        }

        if (errors.length) {
            await this.syncLogsService.fail(log.id, snapshots, errors);
            throw new InternalServerErrorException({ message: 'Синхронизация завершилась с ошибками!', errors });
        } else {
            const finishedAt = await this.syncLogsService.success(log.id, snapshots);
            await this.syncMetaService.updateFullSync(dataSourceId, finishedAt);
        }
    }

    async syncGeneral(dataSourceId: string, mode: SyncMode): Promise<void> {
        const steps: WbSyncMultyStep[] = [
            [SyncScope.Products, (apiToken: string) => this.wbProductsService.syncProducts(apiToken, dataSourceId, mode)],
            [SyncScope.Prices, (apiToken: string) => this.wbPricesService.syncPrices(apiToken, dataSourceId, mode)],
            [SyncScope.Funnel, (apiToken: string) => this.wbFunnelService.syncFunnels(apiToken, dataSourceId, mode)],
            [SyncScope.Stocks, (apiToken: string) => this.wbStocksService.syncStocks(apiToken, dataSourceId, mode)]
        ]

        await this.runMulty(SyncScope.General, dataSourceId, steps, mode);
    }

    async syncAds(dataSourceId: string, mode: SyncMode): Promise<void> {
        const steps: WbSyncMultyStep[] = [
            [SyncScope.AdsCampaigns, (apiToken: string) => this.wbAdsCampaignsService.syncAdsCampaigns(apiToken, dataSourceId, mode)],
            [SyncScope.AdsStats, (apiToken: string) => this.wbAdsStatsService.syncAdsStats(apiToken, dataSourceId, mode)]
        ]

        await this.runMulty(SyncScope.Ads, dataSourceId, steps, mode);
    }

    async syncProducts(dataSourceId: string, mode: SyncMode): Promise<void> {
        await this.runSingle(SyncScope.Products, dataSourceId, async (apiToken: string) => {
            return await this.wbProductsService.syncProducts(apiToken, dataSourceId, mode);
        }, mode);
    }

    async syncPrices(dataSourceId: string, mode: SyncMode): Promise<void> {
        await this.runSingle(SyncScope.Prices, dataSourceId, async (apiToken: string) => {
            return await this.wbPricesService.syncPrices(apiToken, dataSourceId, mode);
        }, mode);
    }

    async syncOrders(dataSourceId: string, mode: SyncMode): Promise<void> {
        await this.runSingle(SyncScope.Orders, dataSourceId, async (apiToken: string) => {
            return await this.wbOrdersService.syncOrders(apiToken, dataSourceId, mode);
        }, mode);
    }

    async syncFunnel(dataSourceId: string, mode: SyncMode): Promise<void> {
        await this.runSingle(SyncScope.Funnel, dataSourceId, async (apiToken: string) => {
            return await this.wbFunnelService.syncFunnels(apiToken, dataSourceId, mode);
        }, mode);
    }

    async syncStocks(dataSourceId: string, mode: SyncMode): Promise<void> {
        await this.runSingle(SyncScope.Stocks, dataSourceId, async (apiToken: string) => {
            return await this.wbStocksService.syncStocks(apiToken, dataSourceId, mode);
        }, mode);
    }

    async syncWarehouses(dataSourceId: string, mode: SyncMode): Promise<void> {
        await this.runSingle(SyncScope.Warehouses, dataSourceId, async () => {
            const snapshot = await this.syncSnapshotsService.create(dataSourceId, SyncScope.Warehouses, mode);
            await this.syncSnapshotsService.fail(snapshot.id);
            return {
                snapshotId: snapshot.id,
                success: false,
                error: 'Синхронизация складов не реализована для WB!'
            }
        }, mode);
    }

    async syncAdsCampaigns(dataSourceId: string, mode: SyncMode): Promise<void> {
        await this.runSingle(SyncScope.AdsCampaigns, dataSourceId, async (apiToken: string) => {
            return await this.wbAdsCampaignsService.syncAdsCampaigns(apiToken, dataSourceId, mode);
        }, mode);
    }

    async syncAdsStats(dataSourceId: string, mode: SyncMode): Promise<void> {
        await this.runSingle(SyncScope.AdsStats, dataSourceId, async (apiToken: string) => {
            return await this.wbAdsStatsService.syncAdsStats(apiToken, dataSourceId, mode);
        }, mode);
    }
}