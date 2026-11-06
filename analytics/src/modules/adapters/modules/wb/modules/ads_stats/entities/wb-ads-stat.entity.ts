import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WbAdsStatBoosterEntity } from "./wb-ads-stat-booster.entity";
import { WbAdsStatDayEntity } from "./wb-ads-stat-day.entity";

@Index('idx_wb_ads_stats_ds_advert_snapshot', ['datasource_id', 'advert_id', 'snapshot_id'])
@Entity('wb_ads_stats')
export class WbAdsStatEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    datasource_id: string;

    @Column({ type: 'uuid' })
    snapshot_id: string;

    @Column({ type: 'int' })
    advert_id: number;

    @Column({ type: 'int' })
    atbs: number;

    @Column({ type: 'int' })
    canceled: number;

    @Column({ type: 'int' })
    clicks: number;

    @Column({ type: 'float' })
    cpc: number;

    @Column({ type: 'float' })
    cr: number;

    @Column({ type: 'float' })
    ctr: number;

    @Column({ type: 'int' })
    orders: number;

    @Column({ type: 'int' })
    shks: number;

    @Column({ type: 'float' })
    sum: number;

    @Column({ type: 'float' })
    sum_price: number;

    @Column({ type: 'int' })
    views: number;

    @OneToMany(() => WbAdsStatBoosterEntity, booster => booster.stat, {
        cascade: true,
    })
    booster_stats: WbAdsStatBoosterEntity[];

    @OneToMany(() => WbAdsStatDayEntity, booster => booster.stat, {
        cascade: true,
    })
    days: WbAdsStatDayEntity[];
}