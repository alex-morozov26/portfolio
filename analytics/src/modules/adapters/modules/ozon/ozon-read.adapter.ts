import { Injectable } from '@nestjs/common';
import { ReadAdapterInterface } from '../../models/read-adapter.interface';
import { OzonProductsService } from './modules/products/ozon-products.service';
import { OzonPricesService } from './modules/prices/ozon-prices.service';
import { OzonOrdersService } from './modules/orders/ozon-orders.service';
import { OzonFunnelService } from './modules/funnel/ozon-funnel.service';
import { OzonStocksService } from './modules/stocks/ozon-stocks.service';
import { OzonWarehousesService } from './modules/warehouses/ozon-warehouses.service';
import { OzonAdsCampaignsService } from './modules/ads/ads_campaigns/ozon-ads-campaigns.service';
import { OzonAdsStatsService } from './modules/ads/ads_stats/ozon-ads-stats.service';

@Injectable()
export class OzonReadAdapter implements ReadAdapterInterface {

    constructor (
        private readonly ozonProductsService: OzonProductsService,
        private readonly ozonPricesService: OzonPricesService,
        private readonly ozonOrdersService: OzonOrdersService,
        private readonly ozonFunnelService: OzonFunnelService,
        private readonly ozonStocksService: OzonStocksService,
        private readonly ozonWarehousesService: OzonWarehousesService,
        private readonly ozonAdsCampaignsService: OzonAdsCampaignsService,
        private readonly ozonAdsStatsService: OzonAdsStatsService
    ) {}

    async readProducts(dataSourceId: string): Promise<any> {
        return this.ozonProductsService.getAllProducts(dataSourceId);
    }

    async readPrices(dataSourceId: string): Promise<any> {
        return this.ozonPricesService.getAllPrices(dataSourceId);
    }

    async readOrders(dataSourceId: string): Promise<any> {
        return this.ozonOrdersService.getAllOrders(dataSourceId);
    }

    async readFunnel(dataSourceId: string): Promise<any> {
        return this.ozonFunnelService.getAllFunnels(dataSourceId);
    }
    
    async readStocks(dataSourceId: string): Promise<any> {
        return this.ozonStocksService.getAllStocks(dataSourceId);
    }

    async readWarehouses(dataSourceId: string): Promise<any> {
        return this.ozonWarehousesService.getAllWarehouses(dataSourceId);
    }

    async readAdsCampaigns(dataSourceId: string): Promise<any> {
        return this.ozonAdsCampaignsService.getAllAdsCampaigns(dataSourceId);
    }

    async readAdsStats(dataSourceId: string): Promise<any> {
        return this.ozonAdsStatsService.getAllAdsStats(dataSourceId);
    }
}