import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OzonWarehouseEntity } from './entities/ozon-warehouse.entity';
import { OzonWarehousesService } from './ozon-warehouses.service';
import { SyncSnapshotsModule } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OzonWarehouseEntity
        ]),
        HttpModule,
        SyncSnapshotsModule
    ],
    providers: [OzonWarehousesService],
    exports: [OzonWarehousesService],
})
export class OzonWarehousesModule { }
