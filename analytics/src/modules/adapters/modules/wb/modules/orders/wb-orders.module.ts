import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WbOrderEntity } from './entities/wb-order.entity';
import { WbOrdersService } from './wb-orders.service';
import { SyncSnapshotsModule } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WbOrderEntity
        ]),
        HttpModule,
        SyncSnapshotsModule
    ],
    providers: [WbOrdersService],
    exports: [WbOrdersService],
})
export class WbOrdersModule { }
