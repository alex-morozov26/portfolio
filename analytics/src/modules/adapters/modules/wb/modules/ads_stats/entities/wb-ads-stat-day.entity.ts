import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WbAdsStatEntity } from "./wb-ads-stat.entity";
import { WbAdsStatDayAppEntity } from "./wb-ads-stat-day-app.entity";

@Entity('wb_ads_stat_days')
export class WbAdsStatDayEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    atbs: number;

    @Column({ type: 'int' })
    canceled: number;

    @Column({ type: 'timestamptz' })
    date: Date;

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

    @ManyToOne(() => WbAdsStatEntity, stat => stat.days, {
        onDelete: 'CASCADE',
    })
    stat: WbAdsStatEntity;

    @OneToMany(() => WbAdsStatDayAppEntity, app => app.day, {
        cascade: true,
    })
    apps: WbAdsStatDayAppEntity[];
}