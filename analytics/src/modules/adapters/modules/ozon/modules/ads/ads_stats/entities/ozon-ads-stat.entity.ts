import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { OzonAdsStatRowEntity } from './ozon-ads-stat-row.entity';

@Index('idx_ozon_ads_stats_ds_campaign_snapshot', ['datasource_id', 'campaign_id', 'snapshot_id'])
@Entity('ozon_ads_stats')
export class OzonAdsStatEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    datasource_id: string;

    @Column({ type: 'uuid' })
    snapshot_id: string;

    @Column({ type: 'bigint' })
    campaign_id: string;

    @Column({ type: 'varchar', nullable: true })
    title: string | null;

    @Column({ type: 'varchar', nullable: true })
    total_search_query: string | null;

    @Column({ type: 'varchar', nullable: true })
    total_views: string | null;

    @Column({ type: 'varchar', nullable: true })
    total_clicks: string | null;

    @Column({ type: 'varchar', nullable: true })
    total_ctr: string | null;

    @Column({ type: 'varchar', nullable: true })
    total_to_cart: string | null;

    @Column({ type: 'varchar', nullable: true })
    total_avg_bid: string | null;

    @Column({ type: 'varchar', nullable: true })
    total_money_spent: string | null;

    @Column({ type: 'varchar', nullable: true })
    total_orders: string | null;

    @Column({ type: 'varchar', nullable: true })
    total_orders_money: string | null;

    @Column({ type: 'varchar', nullable: true })
    total_models: string | null;

    @Column({ type: 'varchar', nullable: true })
    total_models_money: string | null;

    @Column({ type: 'varchar', nullable: true })
    total_ddr: string | null;

    @OneToMany(() => OzonAdsStatRowEntity, row => row.stat, { cascade: true })
    rows: OzonAdsStatRowEntity[];
}
