import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as path from 'path';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { WbPriceEntity } from 'src/modules/adapters/modules/wb/modules/prices/entities/wb-price.entity';
import { WbPriceSizeEntity } from 'src/modules/adapters/modules/wb/modules/prices/entities/wb-price-size.entity';
import { WbOrderEntity } from 'src/modules/adapters/modules/wb/modules/orders/entities/wb-order.entity';
import { WbFunnelEntity } from 'src/modules/adapters/modules/wb/modules/funnel/entities/wb-funnel.entity';
import { WbFunnelHistoryEntity } from 'src/modules/adapters/modules/wb/modules/funnel/entities/wb-funnel-history.entity';
import { WbStockEntity } from 'src/modules/adapters/modules/wb/modules/stocks/entities/wb-stock.entity';
import { WbStockMetricEntity } from 'src/modules/adapters/modules/wb/modules/stocks/entities/wb-stock-metric.entity';
import { WbStockAvgOrdersMonthEntity } from 'src/modules/adapters/modules/wb/modules/stocks/entities/wb-stock-avg-orders-month.entity';
import { WbStockCurrentPriceEntity } from 'src/modules/adapters/modules/wb/modules/stocks/entities/wb-stock-current-price.entity';
import { WbAdsCampaignEntity } from 'src/modules/adapters/modules/wb/modules/ads_campaigns/entities/wb-ads-campaign.entity';
import { WbAdsStatEntity } from 'src/modules/adapters/modules/wb/modules/ads_stats/entities/wb-ads-stat.entity';
import { WbAdsStatBoosterEntity } from 'src/modules/adapters/modules/wb/modules/ads_stats/entities/wb-ads-stat-booster.entity';
import { WbAdsStatDayEntity } from 'src/modules/adapters/modules/wb/modules/ads_stats/entities/wb-ads-stat-day.entity';
import { WbAdsStatDayAppEntity } from 'src/modules/adapters/modules/wb/modules/ads_stats/entities/wb-ads-stat-day-app.entity';
import { WbAdsStatDayAppNmEntity } from 'src/modules/adapters/modules/wb/modules/ads_stats/entities/wb-ads-stat-day-app-nm.entity';
import { OzonProductEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product.entity';
import { OzonProductQuantEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-quant.entity';
import { OzonProductAvailabilityEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-availability.entity';
import { OzonProductAvailabilityReasonEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-availability-reason.entity';
import { OzonProductCommissionEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-commission.entity';
import { OzonProductErrorEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-error.entity';
import { OzonProductErrorParameterEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-error-parameter.entity';
import { OzonProductModelEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-model.entity';
import { OzonProductPriceIndexEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-price-index.entity';
import { OzonProductPromotionEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-promotion.entity';
import { OzonProductSourceEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-source.entity';
import { OzonProductStatusEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-status.entity';
import { OzonProductStockEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-stock.entity';
import { OzonProductStockDataEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-stock-data.entity';
import { OzonProductVisibilityDetailEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-visibility-detail.entity';
import { OzonPriceEntity } from 'src/modules/adapters/modules/ozon/modules/prices/entities/ozon-price.entity';
import { OzonPriceCommissionEntity } from 'src/modules/adapters/modules/ozon/modules/prices/entities/ozon-price-commission.entity';
import { OzonPriceDataEntity } from 'src/modules/adapters/modules/ozon/modules/prices/entities/ozon-price-data.entity';
import { OzonPriceMarketingActionEntity } from 'src/modules/adapters/modules/ozon/modules/prices/entities/ozon-price-marketing-action.entity';
import { OzonPriceMarketingActionDataEntity } from 'src/modules/adapters/modules/ozon/modules/prices/entities/ozon-price-marketing-action-data.entity';
import { OzonPriceIndexEntity } from 'src/modules/adapters/modules/ozon/modules/prices/entities/ozon-price-index.entity';
import { OzonOrderEntity } from 'src/modules/adapters/modules/ozon/modules/orders/entities/ozon-order.entity';
import { OzonOrderProductEntity } from 'src/modules/adapters/modules/ozon/modules/orders/entities/ozon-order-product.entity';
import { OzonOrderFinancialDataEntity } from 'src/modules/adapters/modules/ozon/modules/orders/entities/ozon-order-financial-data.entity';
import { OzonOrderFinancialDataProductEntity } from 'src/modules/adapters/modules/ozon/modules/orders/entities/ozon-order-financial-data-product.entity';
import { OzonOrderAdditionalDataEntity } from 'src/modules/adapters/modules/ozon/modules/orders/entities/ozon-order-additional-data.entity';
import { OzonOrderAnalyticsDataEntity } from 'src/modules/adapters/modules/ozon/modules/orders/entities/ozon-order-analytics-data.entity';
import { OzonOrderLegalInfoEntity } from 'src/modules/adapters/modules/ozon/modules/orders/entities/ozon-order-legal-info.entity';
import { OzonFunnelEntity } from 'src/modules/adapters/modules/ozon/modules/funnel/entities/ozon-funnel.entity';
import { OzonFunnelHistoryEntity } from 'src/modules/adapters/modules/ozon/modules/funnel/entities/ozon-funnel-history.entity';
import { OzonStockEntity } from 'src/modules/adapters/modules/ozon/modules/stocks/entities/ozon-stock.entity';
import { OzonWarehouseEntity } from 'src/modules/adapters/modules/ozon/modules/warehouses/entities/ozon-warehouse.entity';
import { OzonAdsCampaignEntity } from 'src/modules/adapters/modules/ozon/modules/ads/ads_campaigns/entities/ozon-ads-campaign.entity';
import { OzonAdsStatRowEntity } from 'src/modules/adapters/modules/ozon/modules/ads/ads_stats/entities/ozon-ads-stat-row.entity';
import { OzonAdsStatEntity } from 'src/modules/adapters/modules/ozon/modules/ads/ads_stats/entities/ozon-ads-stat.entity';
import { ProjectEntity } from 'src/modules/projects/entities/project.entity';
import { DataSourceEntity } from 'src/modules/data-sources/entities/data-source.entity';
import { WbProductEntity } from 'src/modules/adapters/modules/wb/modules/products/entities/wb-product.entity';
import { WbProductPhotoEntity } from 'src/modules/adapters/modules/wb/modules/products/entities/wb-product-photo.entity';
import { WbProductCharacteristicEntity } from 'src/modules/adapters/modules/wb/modules/products/entities/wb-product-characteristic.entity';
import { WbProductWholesaleEntity } from 'src/modules/adapters/modules/wb/modules/products/entities/wb-product-wholesale.entity';
import { WbProductDimensionEntity } from 'src/modules/adapters/modules/wb/modules/products/entities/wb-product-dimension.entity';
import { WbProductSizeEntity } from 'src/modules/adapters/modules/wb/modules/products/entities/wb-product-size.entity';
import { WbProductTagEntity } from 'src/modules/adapters/modules/wb/modules/products/entities/wb-product-tag.entity';
import { SyncLogEntity } from 'src/modules/sync/modules/sync-logs/entities/sync-log.entity';
import { SyncSnapshotEntity } from 'src/modules/sync/modules/sync-snapshots/entities/sync-snapshot.entity';
import { WbStockSaleRateEntity } from 'src/modules/adapters/modules/wb/modules/stocks/entities/wb-stock-sale-rate.entity';
import { WbStockAvgStockTurnoverEntity } from 'src/modules/adapters/modules/wb/modules/stocks/entities/wb-stock-avg-stock-turnover.entity';
import { WbStockOfficeMissingTimeEntity } from 'src/modules/adapters/modules/wb/modules/stocks/entities/wb-stock-office-missing-time.entity';
import { OzonProductPriceExternalIndexDataEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-price-external-index-data.entity';
import { OzonProductPriceOzonIndexDataEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-price-ozon-index-data.entity';
import { OzonProductPriceMarketplacesIndexDataEntity } from 'src/modules/adapters/modules/ozon/modules/products/entities/ozon-product-price-marketplaces-index-data.entity';
import { OzonPriceExternalIndexDataEntity } from 'src/modules/adapters/modules/ozon/modules/prices/entities/ozon-price-external-index-data.entity';
import { OzonPriceMarketplacesIndexDataEntity } from 'src/modules/adapters/modules/ozon/modules/prices/entities/ozon-price-marketplaces-index-data.entity';
import { OzonPriceOzonIndexDataEntity } from 'src/modules/adapters/modules/ozon/modules/prices/entities/ozon-price-ozon-index-data.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [
        UserEntity,
        WbProductEntity,
        WbProductPhotoEntity,
        WbProductCharacteristicEntity,
        WbProductWholesaleEntity,
        WbProductDimensionEntity,
        WbProductSizeEntity,
        WbProductTagEntity,
        WbPriceEntity,
        WbPriceSizeEntity,
        WbOrderEntity,
        WbFunnelHistoryEntity,
        WbFunnelEntity,
        WbStockAvgOrdersMonthEntity,
        WbStockCurrentPriceEntity,
        WbStockSaleRateEntity,
        WbStockAvgStockTurnoverEntity,
        WbStockOfficeMissingTimeEntity,
        WbStockMetricEntity,
        WbStockEntity,
        WbAdsCampaignEntity,
        WbAdsStatDayAppNmEntity,
        WbAdsStatDayAppEntity,
        WbAdsStatDayEntity,
        WbAdsStatBoosterEntity,
        WbAdsStatEntity,
        OzonProductEntity,
        OzonProductQuantEntity,
        OzonProductAvailabilityEntity,
        OzonProductAvailabilityReasonEntity,
        OzonProductCommissionEntity,
        OzonProductErrorEntity,
        OzonProductErrorParameterEntity,
        OzonProductModelEntity,
        OzonProductPriceIndexEntity,
        OzonProductPriceExternalIndexDataEntity,
        OzonProductPriceOzonIndexDataEntity,
        OzonProductPriceMarketplacesIndexDataEntity,
        OzonProductPromotionEntity,
        OzonProductSourceEntity,
        OzonProductStatusEntity,
        OzonProductStockEntity,
        OzonProductStockDataEntity,
        OzonProductVisibilityDetailEntity,
        OzonPriceEntity,
        OzonPriceCommissionEntity,
        OzonPriceMarketingActionEntity,
        OzonPriceMarketingActionDataEntity,
        OzonPriceDataEntity,
        OzonPriceIndexEntity,
        OzonPriceExternalIndexDataEntity,
        OzonPriceOzonIndexDataEntity,
        OzonPriceMarketplacesIndexDataEntity,
        OzonOrderEntity,
        OzonOrderProductEntity,
        OzonOrderFinancialDataEntity,
        OzonOrderFinancialDataProductEntity,
        OzonOrderAdditionalDataEntity,
        OzonOrderAnalyticsDataEntity,
        OzonOrderLegalInfoEntity,
        OzonFunnelEntity,
        OzonFunnelHistoryEntity,
        OzonStockEntity,
        OzonWarehouseEntity,
        OzonAdsCampaignEntity,
        OzonAdsStatEntity,
        OzonAdsStatRowEntity,
        ProjectEntity,
        DataSourceEntity,
        SyncLogEntity,
        SyncSnapshotEntity,
    ],
    migrations: [path.join(__dirname, '..', 'db/migrations/*.{ts,js}')],
    synchronize: false,
    logging: true,
});
