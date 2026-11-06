export interface ReadAdapterInterface {
    readProducts(dataSourceId: string): Promise<any>;
    readPrices(dataSourceId: string): Promise<any>;
    readOrders(dataSourceId: string): Promise<any>;
    readFunnel(dataSourceId: string): Promise<any>;
    readStocks(dataSourceId: string): Promise<any>;
    readWarehouses(dataSourceId: string): Promise<any>;
    readAdsCampaigns(dataSourceId: string): Promise<any>;
    readAdsStats(dataSourceId: string): Promise<any>;
}