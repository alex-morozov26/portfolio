import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Index('idx_ozon_ads_campaigns_ds_campaign_snapshot', ['datasource_id', 'campaign_id', 'snapshot_id'])
@Entity('ozon_ads_campaigns')
export class OzonAdsCampaignEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    datasource_id: string;

    @Column({ type: 'uuid' })
    snapshot_id: string;

    @Column({ type: 'bigint' })
    campaign_id: string;

    @Column({ type: 'varchar', length: 30 })
    payment_type: string;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'varchar', length: 50 })
    state: string;

    @Column({ type: 'varchar', length: 15 })
    adv_object_type: string;

    @Column({ type: 'date', nullable: true })
    from_date: string | null;

    @Column({ type: 'date', nullable: true })
    to_date: string | null;

    @Column({ type: 'varchar', length: 30 })
    autostop_status: string;

    @Column({ type: 'boolean', default: false })
    is_autocreated: boolean;

    @Column({ type: 'bigint' })
    budget: string;

    @Column({ type: 'bigint' })
    daily_budget: string;

    @Column({ type: 'bigint' })
    weekly_budget: string;

    @Column('varchar', { array: true })
    placement: string[];

    @Column({ type: 'varchar', length: 20 })
    product_autopilot_strategy: string;

    @Column({ type: 'bigint', nullable: true })
    autopilot_category_id: string | null;

    @Column({ type: 'varchar', length: 45, nullable: true })
    autopilot_sku_add_mode: string | null;

    @Column({ type: 'timestamptz' })
    created_at: Date;

    @Column({ type: 'timestamptz' })
    updated_at: Date;

    @Column({ type: 'varchar', length: 30 })
    product_campaign_mode: string;
}
