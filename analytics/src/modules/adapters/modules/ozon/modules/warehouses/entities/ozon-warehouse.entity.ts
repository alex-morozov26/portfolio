import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Index('idx_ozon_warehouses_ds_warehouse_snapshot', ['datasource_id', 'warehouse_id', 'snapshot_id'])
@Entity('ozon_warehouses')
export class OzonWarehouseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    datasource_id: string;

    @Column({ type: 'uuid' })
    snapshot_id: string;

    @Column({ type: 'bigint' })
    cluster_id: string;

    @Column({ type: 'bigint' })
    macrolocal_cluster_id: string;

    @Column({ type: 'varchar' })
    cluster_name: string;

    @Column({ type: 'varchar', length: 30 })
    cluster_type: string;

    @Column({ type: 'bigint' })
    warehouse_id: string;

    @Column({ type: 'varchar', length: 30 })
    warehouse_type: string;

    @Column({ type: 'varchar' })
    warehouse_name: string;
}
