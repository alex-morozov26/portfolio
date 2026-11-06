import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Index('idx_wb_ads_campaigns_ds_advert_snapshot', ['datasource_id', 'advert_id', 'snapshot_id'])
@Entity('wb_ads_campaigns')
export class WbAdsCampaignEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    datasource_id: string;

    @Column({ type: 'uuid' })
    snapshot_id: string;

    @Column({ type: 'timestamptz', nullable: true })
    end_time: Date | null;

    @Column({ type: 'timestamptz' })
    create_time: Date;

    @Column({ type: 'timestamptz', nullable: true })
    change_time: Date | null;

    @Column({ type: 'timestamptz', nullable: true })
    start_time: Date | null;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'int' })
    advert_id: number;

    @Column({ type: 'int', nullable: true })
    status: number | null;

    @Column({ type: 'int', nullable: true })
    type: number | null;

    @Column({ type: 'varchar', nullable: true })
    payment_type: string | null;

    @Column({ type: 'int', nullable: true })
    bid_type: number | null;
}
