import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OzonAdsCampaignsService } from './ozon-ads-campaigns.service';
import { OzonAdsModule } from '../ozon-ads.module';
import { OzonAdsCampaignEntity } from './entities/ozon-ads-campaign.entity';
import { SyncSnapshotsModule } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OzonAdsCampaignEntity
        ]),
        forwardRef(() => OzonAdsModule),
        HttpModule,
        SyncSnapshotsModule
    ],
    providers: [OzonAdsCampaignsService],
    exports: [OzonAdsCampaignsService],
})
export class OzonAdsCampaignsModule { }
