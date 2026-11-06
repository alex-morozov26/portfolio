import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WbPriceEntity } from './entities/wb-price.entity';
import { WbPriceSizeEntity } from './entities/wb-price-size.entity';
import { WbPricesService } from './wb-prices.service';
import { SyncSnapshotsModule } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WbPriceEntity,
            WbPriceSizeEntity,
        ]),
        HttpModule,
        SyncSnapshotsModule
    ],
    providers: [WbPricesService],
    exports: [WbPricesService],
})
export class WbPricesModule { }
