import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WbAdsStatsService } from './wb-ads-stats.service';
import { WbAdsStatEntity } from './entities/wb-ads-stat.entity';
import { WbAdsStatBoosterEntity } from './entities/wb-ads-stat-booster.entity';
import { WbAdsStatDayEntity } from './entities/wb-ads-stat-day.entity';
import { WbAdsStatDayAppEntity } from './entities/wb-ads-stat-day-app.entity';
import { WbAdsStatDayAppNmEntity } from './entities/wb-ads-stat-day-app-nm.entity';
import { SyncSnapshotsModule } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WbAdsStatDayAppNmEntity,
            WbAdsStatDayAppEntity,
            WbAdsStatDayEntity,
            WbAdsStatBoosterEntity,
            WbAdsStatEntity
        ]),
        HttpModule,
        SyncSnapshotsModule
    ],
    providers: [WbAdsStatsService],
    exports: [WbAdsStatsService],
})
export class WbAdsStatsModule { }
