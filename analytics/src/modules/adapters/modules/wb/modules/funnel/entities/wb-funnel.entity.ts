import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WbFunnelHistoryEntity } from "./wb-funnel-history.entity";

@Index('idx_wb_funnel_ds_nm_snapshot', ['datasource_id', 'nm_id', 'snapshot_id'])
@Entity('wb_funnel')
export class WbFunnelEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    datasource_id: string;

    @Column({ type: 'uuid' })
    snapshot_id: string;

    @Column({ type: 'bigint' })
    nm_id: string;

    @Column()
    title: string;

    @Column()
    vendor_code: string;

    @Column()
    brand_name: string;

    @Column({ type: 'bigint' })
    subject_id: string;

    @Column()
    subject_name: string;

    @OneToMany(() => WbFunnelHistoryEntity, history => history.funnel, {
        cascade: true,
    })
    history: WbFunnelHistoryEntity[];
}
