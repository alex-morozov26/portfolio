import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
} from 'typeorm';

@Index('idx_wb_orders_ds_srid_snapshot', ['datasource_id', 'srid', 'snapshot_id'])
@Index(['last_change_date'])
@Index(['date'])
@Entity('wb_orders')
export class WbOrderEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    datasource_id: string;

    @Column({ type: 'uuid' })
    snapshot_id: string;

    @Column({ type: 'varchar' })
    srid: string;

    @Column({ type: 'timestamptz' })
    date: Date;

    @Column({ type: 'timestamptz' })
    last_change_date: Date;

    @Column({ type: 'varchar', length: 50 })
    warehouse_name: string;

    @Column({ type: 'varchar' })
    warehouse_type: 'Склад WB' | 'Склад продавца';

    @Column({ type: 'varchar', length: 200 })
    country_name: string;

    @Column({ type: 'varchar', length: 200 })
    oblast_okrug_name: string;

    @Column({ type: 'varchar', length: 200 })
    region_name: string;

    @Column({ type: 'varchar', length: 75 })
    supplier_article: string;

    @Column({ type: 'bigint' })
    nm_id: string;

    @Column({ type: 'varchar', length: 30 })
    barcode: string;

    @Column({ type: 'varchar', length: 50 })
    category: string;

    @Column({ type: 'varchar', length: 50 })
    subject: string;

    @Column({ type: 'varchar', length: 50 })
    brand: string;

    @Column({ type: 'varchar', length: 30 })
    tech_size: string;

    @Column({ type: 'int' })
    income_id: number;

    @Column({ type: 'boolean' })
    is_supply: boolean;

    @Column({ type: 'boolean' })
    is_realization: boolean;

    @Column({ type: 'numeric' })
    total_price: number;

    @Column({ type: 'int' })
    discount_percent: number;

    @Column({ type: 'numeric' })
    spp: number;

    @Column({ type: 'numeric' })
    finished_price: number;

    @Column({ type: 'numeric' })
    price_with_disc: number;

    @Column({ type: 'boolean' })
    is_cancel: boolean;

    @Column({ type: 'timestamptz', nullable: true })
    cancel_date: Date | null;

    @Column({ type: 'varchar' })
    sticker: string;

    @Column({ type: 'varchar', length: 50 })
    g_number: string;
}
