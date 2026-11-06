import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OzonProductsService } from './ozon-products.service';
import { OzonProductEntity } from './entities/ozon-product.entity';
import { OzonProductQuantEntity } from './entities/ozon-product-quant.entity';
import { OzonProductAvailabilityEntity } from './entities/ozon-product-availability.entity';
import { OzonProductAvailabilityReasonEntity } from './entities/ozon-product-availability-reason.entity';
import { OzonProductCommissionEntity } from './entities/ozon-product-commission.entity';
import { OzonProductErrorEntity } from './entities/ozon-product-error.entity';
import { OzonProductErrorParameterEntity } from './entities/ozon-product-error-parameter.entity';
import { OzonProductModelEntity } from './entities/ozon-product-model.entity';
import { OzonProductPriceIndexEntity } from './entities/ozon-product-price-index.entity';
import { OzonProductPromotionEntity } from './entities/ozon-product-promotion.entity';
import { OzonProductSourceEntity } from './entities/ozon-product-source.entity';
import { OzonProductStatusEntity } from './entities/ozon-product-status.entity';
import { OzonProductStockEntity } from './entities/ozon-product-stock.entity';
import { OzonProductStockDataEntity } from './entities/ozon-product-stock-data.entity';
import { OzonProductVisibilityDetailEntity } from './entities/ozon-product-visibility-detail.entity';
import { SyncSnapshotsModule } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.module';
import { OzonProductPriceExternalIndexDataEntity } from './entities/ozon-product-price-external-index-data.entity';
import { OzonProductPriceOzonIndexDataEntity } from './entities/ozon-product-price-ozon-index-data.entity';
import { OzonProductPriceMarketplacesIndexDataEntity } from './entities/ozon-product-price-marketplaces-index-data.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([
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
        ]),
        HttpModule,
        SyncSnapshotsModule
    ],
    providers: [OzonProductsService],
    exports: [OzonProductsService],
})
export class OzonProductsModule { }
