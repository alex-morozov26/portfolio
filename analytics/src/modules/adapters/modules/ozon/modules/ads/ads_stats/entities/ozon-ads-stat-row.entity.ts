import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OzonAdsStatEntity } from './ozon-ads-stat.entity';

@Entity('ozon_ads_stat_rows')
export class OzonAdsStatRowEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OzonAdsStatEntity, stat => stat.rows, { onDelete: 'CASCADE' })
    stat: OzonAdsStatEntity;

    @Column({ type: 'bigint', nullable: true })
    sku: string | null;

    @Column({ type: 'varchar', nullable: true })
    title: string | null;

    @Column({ type: 'varchar', nullable: true })
    price: string | null;

    @Column({ type: 'varchar', nullable: true })
    search_query: string | null;

    @Column({ type: 'varchar', nullable: true })
    views: string | null;

    @Column({ type: 'varchar', nullable: true })
    clicks: string | null;

    @Column({ type: 'varchar', nullable: true })
    ctr: string | null;

    @Column({ type: 'varchar', nullable: true })
    to_cart: string | null;

    @Column({ type: 'varchar', nullable: true })
    avg_bid: string | null;

    @Column({ type: 'varchar', nullable: true })
    money_spent: string | null;

    @Column({ type: 'varchar', nullable: true })
    orders: string | null;

    @Column({ type: 'varchar', nullable: true })
    orders_money: string | null;

    @Column({ type: 'varchar', nullable: true })
    models: string | null;

    @Column({ type: 'varchar', nullable: true })
    models_money: string | null;

    @Column({ type: 'varchar', nullable: true })
    ddr: string | null;

    @Column({ type: 'date' })
    created_at: string;
}
