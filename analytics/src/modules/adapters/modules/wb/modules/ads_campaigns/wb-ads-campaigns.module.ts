import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WbAdsCampaignsService } from './wb-ads-campaigns.service';
import { WbAdsCampaignEntity } from './entities/wb-ads-campaign.entity';
import { SyncSnapshotsModule } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WbAdsCampaignEntity
        ]),
        HttpModule,
        SyncSnapshotsModule
    ],
    providers: [WbAdsCampaignsService],
    exports: [WbAdsCampaignsService],
})
export class WbAdsCampaignsModule { }
