import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { OzonOrderEntity } from './ozon-order.entity';


@Entity('ozon_order_analytics_data')
export class OzonOrderAnalyticsDataEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => OzonOrderEntity, order => order.analytics_data, { onDelete: 'CASCADE' })
    @JoinColumn()
    order: OzonOrderEntity;

    @Column({ type: 'varchar' })
    city: string;

    @Column({ type: 'varchar' })
    delivery_type: string;

    @Column({ type: 'boolean', default: false })
    is_legal: boolean;

    @Column({ type: 'boolean', default: false })
    is_premium: boolean;

    @Column({ type: 'varchar', length: 50 })
    payment_type_group_name: string;

    @Column({ type: 'bigint' })
    warehouse_id: string;

    @Column({ type: 'varchar' })
    warehouse_name: string;

    @Column({ type: 'timestamptz', nullable: true })
    client_delivery_date_begin: Date | null;

    @Column({ type: 'timestamptz', nullable: true })
    client_delivery_date_end: Date | null;
}
