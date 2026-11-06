import { Module } from '@nestjs/common';
import { CredentialsModule } from 'src/modules/credentials/credentials.module';
import { WbSyncAdapter } from './wb-sync.adapter';
import { WbProductsModule } from './modules/products/wb-products.module';
import { WbReadAdapter } from './wb-read.adapter';
import { WbPricesModule } from './modules/prices/wb-prices.module';
import { WbOrdersModule } from './modules/orders/wb-orders.module';
import { WbFunnelModule } from './modules/funnel/wb-funnel.module';
import { WbStocksModule } from './modules/stocks/wb-stocks.module';
import { WbAdsCampaignsModule } from './modules/ads_campaigns/wb-ads-campaigns.module';
import { WbAdsStatsModule } from './modules/ads_stats/wb-ads-stats.module';
import { SyncLogsModule } from 'src/modules/sync/modules/sync-logs/sync-logs.module';
import { SyncMetaModule } from 'src/modules/sync/modules/sync-meta/sync-meta.module';
import { SyncSnapshotsModule } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.module';

@Module({
    imports: [
        CredentialsModule,
        SyncLogsModule,
        SyncMetaModule,
        SyncSnapshotsModule,
        WbProductsModule,
        WbPricesModule,
        WbOrdersModule,
        WbFunnelModule,
        WbStocksModule,
        WbAdsCampaignsModule,
        WbAdsStatsModule
    ],
    providers: [
        WbSyncAdapter,
        WbReadAdapter
    ],
    exports: [
        WbSyncAdapter,
        WbReadAdapter
    ],
})
export class WbAdapterModule { }