import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OzonFunnelEntity } from './entities/ozon-funnel.entity';
import { OzonFunnelHistoryEntity } from './entities/ozon-funnel-history.entity';
import { OzonFunnelService } from './ozon-funnel.service';
import { SyncSnapshotsModule } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OzonFunnelEntity,
            OzonFunnelHistoryEntity,
        ]),
        HttpModule,
        SyncSnapshotsModule
    ],
    providers: [OzonFunnelService],
    exports: [OzonFunnelService],
})
export class OzonFunnelModule { }
