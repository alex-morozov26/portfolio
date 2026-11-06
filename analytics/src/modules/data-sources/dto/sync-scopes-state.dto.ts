import { ApiPropertyOptional } from "@nestjs/swagger";

export class SyncScopesStateDto {
    @ApiPropertyOptional({ type: String })
    products?: Date;

    @ApiPropertyOptional({ type: String })
    prices?: Date;

    @ApiPropertyOptional({ type: String })
    orders?: Date;

    @ApiPropertyOptional({ type: String })
    funnel?: Date;

    @ApiPropertyOptional({ type: String })
    stocks?: Date;

    @ApiPropertyOptional({ type: String })
    warehouses?: Date;

    @ApiPropertyOptional({ type: String })
    ads_campaigns?: Date;

    @ApiPropertyOptional({ type: String })
    ads_stats?: Date;
}