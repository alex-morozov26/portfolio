import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OzonPricesService } from './ozon-prices.service';
import { OzonPriceEntity } from './entities/ozon-price.entity';
import { OzonPriceCommissionEntity } from './entities/ozon-price-commission.entity';
import { OzonPriceMarketingActionEntity } from './entities/ozon-price-marketing-action.entity';
import { OzonPriceMarketingActionDataEntity } from './entities/ozon-price-marketing-action-data.entity';
import { OzonPriceDataEntity } from './entities/ozon-price-data.entity';
import { OzonPriceIndexEntity } from './entities/ozon-price-index.entity';
import { SyncSnapshotsModule } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.module';
import { OzonPriceOzonIndexDataEntity } from './entities/ozon-price-ozon-index-data.entity';
import { OzonPriceExternalIndexDataEntity } from './entities/ozon-price-external-index-data.entity';
import { OzonPriceMarketplacesIndexDataEntity } from './entities/ozon-price-marketplaces-index-data.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            OzonPriceEntity,
            OzonPriceCommissionEntity,
            OzonPriceMarketingActionEntity,
            OzonPriceMarketingActionDataEntity,
            OzonPriceDataEntity,
            OzonPriceIndexEntity,
            OzonPriceExternalIndexDataEntity,
            OzonPriceOzonIndexDataEntity,
            OzonPriceMarketplacesIndexDataEntity
        ]),
        HttpModule,
        SyncSnapshotsModule
    ],
    providers: [OzonPricesService],
    exports: [OzonPricesService],
})
export class OzonPricesModule { }
