import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Index('idx_ozon_stocks_ds_identity_snapshot', ['datasource_id', 'identity', 'snapshot_id'])
@Entity('ozon_stocks')
export class OzonStockEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 64 })
    identity: string;

    @Column({ type: 'uuid' })
    datasource_id: string;

    @Column({ type: 'uuid' })
    snapshot_id: string;

    @Column({ type: 'float' })
    ads: number;

    @Column({ type: 'float' })
    ads_cluster: number;

    @Column({ type: 'int' })
    available_stock_count: number;

    @Column({ type: 'bigint' })
    cluster_id: string;

    @Column({ type: 'varchar' })
    cluster_name: string;

    @Column({ type: 'int' })
    days_without_sales: number;

    @Column({ type: 'int' })
    days_without_sales_cluster: number;

    @Column({ type: 'int' })
    excess_stock_count: number;

    @Column({ type: 'int' })
    expiring_stock_count: number;

    @Column({ type: 'float' })
    idc: number;

    @Column({ type: 'float' })
    idc_cluster: number;

    @Column('varchar', { array: true })
    item_tags: string[];

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    offer_id: string;

    @Column({ type: 'int' })
    other_stock_count: number;

    @Column({ type: 'int' })
    requested_stock_count: number;

    @Column({ type: 'int' })
    return_from_customer_stock_count: number;

    @Column({ type: 'int' })
    return_to_seller_stock_count: number;

    @Column({ type: 'bigint' })
    sku: string;

    @Column({ type: 'int' })
    stock_defect_stock_count: number;

    @Column({ type: 'int' })
    transit_defect_stock_count: number;

    @Column({ type: 'int' })
    transit_stock_count: number;

    @Column({ type: 'varchar', length: 25 })
    turnover_grade: string;

    @Column({ type: 'varchar', length: 25 })
    turnover_grade_cluster: string;

    @Column({ type: 'int' })
    valid_stock_count: number;

    @Column({ type: 'int' })
    waiting_docs_stock_count: number;

    @Column({ type: 'bigint' })
    warehouse_id: string;

    @Column({ type: 'varchar' })
    warehouse_name: string;
}
