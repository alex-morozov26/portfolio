import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OzonStocksService } from './ozon-stocks.service';
import { OzonStockEntity } from './entities/ozon-stock.entity';
import { SyncSnapshotsModule } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OzonStockEntity
        ]),
        HttpModule,
        SyncSnapshotsModule
    ],
    providers: [OzonStocksService],
    exports: [OzonStocksService],
})
export class OzonStocksModule { }
