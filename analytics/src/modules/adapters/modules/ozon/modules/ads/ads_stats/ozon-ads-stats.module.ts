import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OzonAdsModule } from '../ozon-ads.module';
import { OzonAdsStatsService } from './ozon-ads-stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OzonAdsStatEntity } from './entities/ozon-ads-stat.entity';
import { OzonAdsStatRowEntity } from './entities/ozon-ads-stat-row.entity';
import { SyncSnapshotsModule } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OzonAdsStatEntity,
            OzonAdsStatRowEntity
        ]),
        forwardRef(() => OzonAdsModule),
        HttpModule,
        SyncSnapshotsModule
    ],
    providers: [OzonAdsStatsService],
    exports: [OzonAdsStatsService],
})
export class OzonAdsStatsModule { }
