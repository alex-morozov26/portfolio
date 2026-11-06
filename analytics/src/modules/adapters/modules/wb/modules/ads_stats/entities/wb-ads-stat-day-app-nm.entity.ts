import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WbAdsStatDayAppEntity } from "./wb-ads-stat-day-app.entity";

@Entity('wb_ads_stat_day_app_nms')
export class WbAdsStatDayAppNmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'int' })
    nm_id: number;

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

    @ManyToOne(() => WbAdsStatDayAppEntity, app => app.nms, {
        onDelete: 'CASCADE',
    })
    app: WbAdsStatDayAppEntity;
}