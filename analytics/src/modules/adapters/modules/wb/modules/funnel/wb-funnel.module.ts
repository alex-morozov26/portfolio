import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WbFunnelEntity } from './entities/wb-funnel.entity';
import { WbFunnelHistoryEntity } from './entities/wb-funnel-history.entity';
import { WbFunnelService } from './wb-funnel.service';
import { SyncSnapshotsModule } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WbFunnelEntity,
            WbFunnelHistoryEntity,
        ]),
        HttpModule,
        SyncSnapshotsModule
    ],
    providers: [WbFunnelService],
    exports: [WbFunnelService],
})
export class WbFunnelModule { }
