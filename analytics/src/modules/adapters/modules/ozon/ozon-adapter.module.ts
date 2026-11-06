import { Module } from '@nestjs/common';
import { CredentialsModule } from 'src/modules/credentials/credentials.module';
import { OzonSyncAdapter } from './ozon-sync.adapter';
import { OzonReadAdapter } from './ozon-read.adapter';
import { OzonProductsModule } from './modules/products/ozon-products.module';
import { OzonPricesModule } from './modules/prices/ozon-prices.module';
import { OzonOrdersModule } from './modules/orders/ozon-orders.module';
import { OzonFunnelModule } from './modules/funnel/ozon-funnel.module';
import { OzonStocksModule } from './modules/stocks/ozon-stocks.module';
import { OzonWarehousesModule } from './modules/warehouses/ozon-warehouses.module';
import { OzonAdsModule } from './modules/ads/ozon-ads.module';
import { SyncLogsModule } from 'src/modules/sync/modules/sync-logs/sync-logs.module';
import { SyncMetaModule } from 'src/modules/sync/modules/sync-meta/sync-meta.module';

@Module({
    imports: [
        CredentialsModule,
        SyncLogsModule,
        SyncMetaModule,
        OzonProductsModule,
        OzonPricesModule,
        OzonOrdersModule,
        OzonFunnelModule,
        OzonStocksModule,
        OzonWarehousesModule,
        OzonAdsModule
    ],
    providers: [
        OzonSyncAdapter,
        OzonReadAdapter
    ],
    exports: [
        OzonSyncAdapter,
        OzonReadAdapter
    ],
})
export class OzonAdapterModule { }