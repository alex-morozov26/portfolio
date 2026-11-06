import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CredentialsService } from 'src/modules/credentials/credentials.service';
import { SyncAdapterInterface } from '../../models/sync-adapter.interface';
import { OzonApiCredentials, OzonPerformanceApiCredentials, OzonSellerApiCredentials } from './models/credentials.type';
import { OzonProductsService } from './modules/products/ozon-products.service';
import { OzonPricesService } from './modules/prices/ozon-prices.service';
import { OzonOrdersService } from './modules/orders/ozon-orders.service';
import { OzonFunnelService } from './modules/funnel/ozon-funnel.service';
import { OzonStocksService } from './modules/stocks/ozon-stocks.service';
import { OzonWarehousesService } from './modules/warehouses/ozon-warehouses.service';
import { OzonAdsCampaignsService } from './modules/ads/ads_campaigns/ozon-ads-campaigns.service';
import { OzonAdsStatsService } from './modules/ads/ads_stats/ozon-ads-stats.service';
import { SyncMode } from '../../models/sync-mode.enum';
import { SyncLogsService } from 'src/modules/sync/modules/sync-logs/sync-logs.service';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { DataSourceType } from 'src/modules/data-sources/models/data-source-type.enum';
import { SyncError } from 'src/modules/sync/modules/sync-logs/models/sync-error.interface';
import { SyncMetaService } from 'src/modules/sync/modules/sync-meta/sync-meta.service';
import { OzonSyncMultyStep, OzonSyncStep } from './models/ozon-sync-step.type';

@Injectable()
export class OzonSyncAdapter implements SyncAdapterInterface {

    constructor (
        private readonly credentialsService: CredentialsService,
        private readonly syncLogsService: SyncLogsService,
        private readonly syncMetaService: SyncMetaService,
        private readonly ozonProductsService: OzonProductsService,
        private readonly ozonPricesService: OzonPricesService,
        private readonly ozonOrdersService: OzonOrdersService,
        private readonly ozonFunnelService: OzonFunnelService,
        private readonly ozonStocksService: OzonStocksService,
        private readonly ozonWarehousesService: OzonWarehousesService,
        private readonly ozonAdsCampaignsService: OzonAdsCampaignsService,
        private readonly ozonAdsStatsService: OzonAdsStatsService
    ) {}

    private readonly sellerScopes = new Set<SyncScope>([
        SyncScope.General,
        SyncScope.Products,
        SyncScope.Prices,
        SyncScope.Orders,
        SyncScope.Funnel,
        SyncScope.Stocks,
        SyncScope.Warehouses
    ]);

    private readonly performanceScopes = new Set<SyncScope>([
        SyncScope.Ads,
        SyncScope.AdsCampaigns,
        SyncScope.AdsStats
    ]);

    private async getSellerApiCredentials(dataSourceId: string): Promise<OzonSellerApiCredentials> {
        const credentials = await this.credentialsService.getCredentials(dataSourceId);
        const clientId = credentials.ozon_client_id;
        const apiKey = credentials.ozon_api_key;

        if (!clientId || !apiKey) {
            throw new Error('Данные для доступа к Ozon Seller API не найдены!')
        }

        return { clientId, apiKey };
    }

    private async getPerformanceApiCredentials(dataSourceId: string): Promise<OzonPerformanceApiCredentials> {
        const credentials = await this.credentialsService.getCredentials(dataSourceId);
        const clientId = credentials.ozon_performance_client_id;
        const clientSecret = credentials.ozon_performance_client_secret;

        if (!clientId || !clientSecret) {
            throw new Error('Данные для доступа к Ozon Performance API не найдены!')
        }

        return { clientId, clientSecret };
    }

    private needSellerApiCredentials(scope: SyncScope): boolean {
        return this.sellerScopes.has(scope);
    }

    private needPerformanceApiCredentials(scope: SyncScope): boolean {
        return this.performanceScopes.has(scope);
    }

    private async getOzonApiCredentials(dataSourceId: string, scope: SyncScope): Promise<OzonApiCredentials> {
        let sellerApiCredentials: OzonSellerApiCredentials | undefined = undefined;
        let performanceApiCredentials: OzonPerformanceApiCredentials | undefined = undefined;

        if (this.needSellerApiCredentials(scope)) {
            sellerApiCredentials = await this.getSellerApiCredentials(dataSourceId);
        }

        if (this.needPerformanceApiCredentials(scope)) {
            performanceApiCredentials = await this.getPerformanceApiCredentials(dataSourceId);
        }

        return {
            seller: sellerApiCredentials,
            performance: performanceApiCredentials
        }
    } 

    private async runSingle(
        scope: SyncScope,
        dataSourceId: string,
        step: OzonSyncStep,
        mode: SyncMode
    ) {
        const log = await this.syncLogsService.start(scope, dataSourceId, DataSourceType.Ozon, mode);
        
        let credentials: OzonApiCredentials;

        try {
            credentials = await this.getOzonApiCredentials(dataSourceId, scope);
        } catch (error) {
            const errors = [
                {
                    scope: scope,
                    message: error?.message ?? 'Ошибка получения API токенов!',
                }
            ]
            await this.syncLogsService.fail(log.id, [], errors);
            throw new InternalServerErrorException({ message: 'Синхронизация завершилась с ошибками!', errors });
        }

        const result = await step(credentials);
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
        steps: OzonSyncMultyStep[],
        mode: SyncMode
    ) {
        const log = await this.syncLogsService.start(scope, dataSourceId, DataSourceType.Ozon, mode);
        
        let credentials: OzonApiCredentials;

        try {
            credentials = await this.getOzonApiCredentials(dataSourceId, scope);
        } catch (error) {
            const errors = [
                {
                    scope: scope,
                    message: error?.message ?? 'Ошибка получения API токенов!',
                }
            ]
            await this.syncLogsService.fail(log.id, [], errors);
            throw new InternalServerErrorException({ message: 'Синхронизация завершилась с ошибками!', errors });
        }

        const errors: SyncError[] = []
        const snapshots: string[] = []

        for (const [stepScope, step] of steps) {
            const result = await step(credentials);
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
        const steps: OzonSyncMultyStep[] = [
            [SyncScope.Products, ({ seller }) => {
                return this.ozonProductsService.syncProducts(seller!.clientId, seller!.apiKey, dataSourceId, mode);
            }],
            [SyncScope.Prices, ({ seller }) => {
                return this.ozonPricesService.syncPrices(seller!.clientId, seller!.apiKey, dataSourceId, mode);
            }],
            [SyncScope.Funnel, ({ seller }) => {
                return this.ozonFunnelService.syncFunnels(seller!.clientId, seller!.apiKey, dataSourceId, mode);
            }],
            [SyncScope.Stocks, ({ seller }) => {
                return this.ozonStocksService.syncStocks(seller!.clientId, seller!.apiKey, dataSourceId, mode);
            }],
            [SyncScope.Warehouses, ({ seller }) => {
                return this.ozonWarehousesService.syncWarehouses(seller!.clientId, seller!.apiKey, dataSourceId, mode);
            }]
        ]

        await this.runMulty(SyncScope.General, dataSourceId, steps, mode);
    }

    async syncAds(dataSourceId: string, mode: SyncMode): Promise<void> {
        const steps: OzonSyncMultyStep[] = [
            [SyncScope.AdsCampaigns, ({ performance }) => {
                return this.ozonAdsCampaignsService.syncAdsCampaigns(performance!.clientId, performance!.clientSecret, dataSourceId, mode);
            }],
            [SyncScope.AdsStats, ({ performance }) => {
                return this.ozonAdsStatsService.syncAdsStats(performance!.clientId, performance!.clientSecret, dataSourceId, mode);
            }]
        ]

        await this.runMulty(SyncScope.Ads, dataSourceId, steps, mode);
    }

    async syncProducts(dataSourceId: string, mode: SyncMode): Promise<void> {
        await this.runSingle(SyncScope.Products, dataSourceId, async ({ seller }) => {
            return await this.ozonProductsService.syncProducts(seller!.clientId, seller!.apiKey, dataSourceId, mode);
        }, mode);
    }

    async syncPrices(dataSourceId: string, mode: SyncMode): Promise<void> {
        await this.runSingle(SyncScope.Prices, dataSourceId, async ({ seller }) => {
            return await this.ozonPricesService.syncPrices(seller!.clientId, seller!.apiKey, dataSourceId, mode);
        }, mode);
    }

    async syncOrders(dataSourceId: string, mode: SyncMode): Promise<void> {
        await this.runSingle(SyncScope.Orders, dataSourceId, async ({ seller }) => {
            return await this.ozonOrdersService.syncOrders(seller!.clientId, seller!.apiKey, dataSourceId, mode);
        }, mode);
    }

    async syncFunnel(dataSourceId: string, mode: SyncMode): Promise<void> {
        await this.runSingle(SyncScope.Funnel, dataSourceId, async ({ seller }) => {
            return await this.ozonFunnelService.syncFunnels(seller!.clientId, seller!.apiKey, dataSourceId, mode);
        }, mode);
    }

    async syncStocks(dataSourceId: string, mode: SyncMode): Promise<void> {
        await this.runSingle(SyncScope.Stocks, dataSourceId, async ({ seller }) => {
            return await this.ozonStocksService.syncStocks(seller!.clientId, seller!.apiKey, dataSourceId, mode);
        }, mode);
    }

    async syncWarehouses(dataSourceId: string, mode: SyncMode): Promise<void> {
        await this.runSingle(SyncScope.Warehouses, dataSourceId, async ({ seller }) => {
            return await this.ozonWarehousesService.syncWarehouses(seller!.clientId, seller!.apiKey, dataSourceId, mode);
        }, mode);
    }

    async syncAdsCampaigns(dataSourceId: string, mode: SyncMode): Promise<void> {
        await this.runSingle(SyncScope.AdsCampaigns, dataSourceId, async ({ performance }) => {
            return await this.ozonAdsCampaignsService.syncAdsCampaigns(performance!.clientId, performance!.clientSecret, dataSourceId, mode);
        }, mode);
    }

    async syncAdsStats(dataSourceId: string, mode: SyncMode): Promise<void> {
        await this.runSingle(SyncScope.AdsStats, dataSourceId, async ({ performance }) => {
            return await this.ozonAdsStatsService.syncAdsStats(performance!.clientId, performance!.clientSecret, dataSourceId, mode);
        }, mode);
    }
}