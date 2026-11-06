import { Injectable, NotImplementedException } from '@nestjs/common';
import { WbProductsService } from './modules/products/wb-products.service';
import { ReadAdapterInterface } from '../../models/read-adapter.interface';
import { WbPricesService } from './modules/prices/wb-prices.service';
import { WbOrdersService } from './modules/orders/wb-orders.service';
import { WbFunnelService } from './modules/funnel/wb-funnel.service';
import { WbStocksService } from './modules/stocks/wb-stocks.service';
import { WbAdsCampaignsService } from './modules/ads_campaigns/wb-ads-campaigns.service';
import { WbAdsStatsService } from './modules/ads_stats/wb-ads-stats.service';

@Injectable()
export class WbReadAdapter implements ReadAdapterInterface {

    constructor (
        private readonly wbProductsService: WbProductsService,
        private readonly wbPricesService: WbPricesService,
        private readonly wbOrdersService: WbOrdersService,
        private readonly wbFunnelService: WbFunnelService,
        private readonly wbStocksService: WbStocksService,
        private readonly wbAdsCampaignsService: WbAdsCampaignsService,
        private readonly wbAdsStatsService: WbAdsStatsService
    ) {}

    async readProducts(dataSourceId: string): Promise<any> {
        return this.wbProductsService.getAllProducts(dataSourceId);
    }

    async readPrices(dataSourceId: string): Promise<any> {
        return this.wbPricesService.getAllPrices(dataSourceId);
    }

    async readOrders(dataSourceId: string): Promise<any> {
        return this.wbOrdersService.getAllOrders(dataSourceId);
    }

    async readFunnel(dataSourceId: string): Promise<any> {
        return this.wbFunnelService.getAllFunnels(dataSourceId);
    }
    
    async readStocks(dataSourceId: string): Promise<any> {
        return this.wbStocksService.getAllStocks(dataSourceId);
    }

    async readWarehouses(dataSourceId: string): Promise<any> {
        throw new NotImplementedException('Получение складов не реализовано для WB!');
    }

    async readAdsCampaigns(dataSourceId: string): Promise<any> {
        return this.wbAdsCampaignsService.getAllAdsCampaigns(dataSourceId);
    }

    async readAdsStats(dataSourceId: string): Promise<any> {
        return this.wbAdsStatsService.getAllAdsStats(dataSourceId);
    }
}