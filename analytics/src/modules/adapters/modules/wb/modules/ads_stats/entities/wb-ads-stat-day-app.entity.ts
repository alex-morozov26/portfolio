import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WbAdsStatDayEntity } from "./wb-ads-stat-day.entity";
import { WbAdsStatDayAppNmEntity } from "./wb-ads-stat-day-app-nm.entity";

@Entity('wb_ads_stat_day_apps')
export class WbAdsStatDayAppEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    app_type: number;

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

    @ManyToOne(() => WbAdsStatDayEntity, day => day.apps, {
        onDelete: 'CASCADE',
    })
    day: WbAdsStatDayEntity;

    @OneToMany(() => WbAdsStatDayAppNmEntity, nm => nm.app, {
        cascade: true,
    })
    nms: WbAdsStatDayAppNmEntity[];
}