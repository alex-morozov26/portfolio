import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { OzonFunnelHistoryEntity } from './ozon-funnel-history.entity';

@Index('idx_ozon_funnel_ds_sku_snapshot', ['datasource_id', 'sku', 'snapshot_id'])
@Entity('ozon_funnel')
export class OzonFunnelEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    datasource_id: string;

    @Column({ type: 'uuid' })
    snapshot_id: string;

    @Column({ type: 'bigint' })
    sku: string;

    @Column({ type: 'varchar' })
    name: string;

    @OneToMany(() => OzonFunnelHistoryEntity, history => history.funnel, { cascade: true })
    history: OzonFunnelHistoryEntity[];
}
