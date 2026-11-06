import { SyncMode } from "./sync-mode.enum";

export interface SyncAdapterInterface {
    syncProducts(dataSourceId: string, mode: SyncMode): Promise<void>;
    syncPrices(dataSourceId: string, mode: SyncMode): Promise<void>;
    syncOrders(dataSourceId: string, mode: SyncMode): Promise<void>;
    syncFunnel(dataSourceId: string, mode: SyncMode): Promise<void>;
    syncStocks(dataSourceId: string, mode: SyncMode): Promise<void>;
    syncWarehouses(dataSourceId: string, mode: SyncMode): Promise<void>;
    syncAdsCampaigns(dataSourceId: string, mode: SyncMode): Promise<void>;
    syncAdsStats(dataSourceId: string, mode: SyncMode): Promise<void>;
    // sync(dataSourceId: string, mode: SyncMode): Promise<void>;
    syncGeneral(dataSourceId: string, mode: SyncMode): Promise<void>;
    syncAds(dataSourceId: string, mode: SyncMode): Promise<void>;
}