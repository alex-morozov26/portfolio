import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Index } from 'typeorm';
import { WbStockMetricEntity } from './wb-stock-metric.entity';

@Index('idx_wb_stocks_ds_nm_snapshot', ['datasource_id', 'nm_id', 'snapshot_id'])
@Entity('wb_stocks')
export class WbStockEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    datasource_id: string;

    @Column({ type: 'uuid' })
    snapshot_id: string;

    @Column({ type: 'bigint' })
    nm_id: string;

    @Column({ type: 'boolean' })
    is_deleted: boolean;

    @Column({ type: 'varchar' })
    subject_name: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    vendor_code: string;

    @Column({ type: 'varchar' })
    brand_name: string;

    @Column({ type: 'varchar' })
    main_photo: string;

    @Column({ type: 'boolean' })
    has_sizes: boolean;

    @OneToOne(() => WbStockMetricEntity, metrics => metrics.stock, { cascade: true })
    metrics: WbStockMetricEntity;
}
