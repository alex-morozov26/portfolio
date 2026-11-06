import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OzonOrdersService } from './ozon-orders.service';
import { OzonOrderEntity } from './entities/ozon-order.entity';
import { OzonOrderProductEntity } from './entities/ozon-order-product.entity';
import { OzonOrderFinancialDataEntity } from './entities/ozon-order-financial-data.entity';
import { OzonOrderFinancialDataProductEntity } from './entities/ozon-order-financial-data-product.entity';
import { OzonOrderAdditionalDataEntity } from './entities/ozon-order-additional-data.entity';
import { OzonOrderAnalyticsDataEntity } from './entities/ozon-order-analytics-data.entity';
import { OzonOrderLegalInfoEntity } from './entities/ozon-order-legal-info.entity';
import { SyncSnapshotsModule } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OzonOrderEntity,
            OzonOrderProductEntity,
            OzonOrderFinancialDataEntity,
            OzonOrderFinancialDataProductEntity,
            OzonOrderAdditionalDataEntity,
            OzonOrderAnalyticsDataEntity,
            OzonOrderLegalInfoEntity
        ]),
        HttpModule,
        SyncSnapshotsModule
    ],
    providers: [OzonOrdersService],
    exports: [OzonOrdersService],
})
export class OzonOrdersModule { }
