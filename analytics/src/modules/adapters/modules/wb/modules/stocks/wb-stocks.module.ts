import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WbStockEntity } from './entities/wb-stock.entity';
import { WbStockMetricEntity } from './entities/wb-stock-metric.entity';
import { WbStockAvgOrdersMonthEntity } from './entities/wb-stock-avg-orders-month.entity';
import { WbStockCurrentPriceEntity } from './entities/wb-stock-current-price.entity';
import { WbStocksService } from './wb-stocks.service';
import { SyncSnapshotsModule } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.module';
import { WbStockAvgStockTurnoverEntity } from './entities/wb-stock-avg-stock-turnover.entity';
import { WbStockSaleRateEntity } from './entities/wb-stock-sale-rate.entity';
import { WbStockOfficeMissingTimeEntity } from './entities/wb-stock-office-missing-time.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WbStockEntity,
            WbStockMetricEntity,
            WbStockAvgOrdersMonthEntity,
            WbStockSaleRateEntity,
            WbStockOfficeMissingTimeEntity,
            WbStockAvgStockTurnoverEntity,
            WbStockCurrentPriceEntity,
        ]),
        HttpModule,
        SyncSnapshotsModule
    ],
    providers: [WbStocksService],
    exports: [WbStocksService],
})
export class WbStocksModule { }
