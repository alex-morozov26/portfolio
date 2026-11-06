import { forwardRef, Module } from '@nestjs/common';
import { OzonAdsService } from './ozon-ads.service';
import { HttpModule } from '@nestjs/axios';
import { OzonAdsCampaignsModule } from './ads_campaigns/ozon-ads-campaigns.module';
import { OzonAdsStatsModule } from './ads_stats/ozon-ads-stats.module';


@Module({
    imports: [
        forwardRef(() => OzonAdsCampaignsModule),
        forwardRef(() => OzonAdsStatsModule),
        HttpModule
    ],
    providers: [OzonAdsService],
    exports: [
        OzonAdsService,
        OzonAdsCampaignsModule,
        OzonAdsStatsModule
    ]
})
export class OzonAdsModule { }
