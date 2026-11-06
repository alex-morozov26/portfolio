import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, Index } from 'typeorm';
import { OzonOrderProductEntity } from './ozon-order-product.entity';
import { OzonOrderLegalInfoEntity } from './ozon-order-legal-info.entity';
import { OzonOrderAnalyticsDataEntity } from './ozon-order-analytics-data.entity';
import { OzonOrderAdditionalDataEntity } from './ozon-order-additional-data.entity';
import { OzonOrderFinancialDataEntity } from './ozon-order-financial-data.entity';

@Index('idx_ozon_orders_ds_posting_snapshot', ['datasource_id', 'posting_number', 'snapshot_id'])
@Entity('ozon_orders')
export class OzonOrderEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    datasource_id: string;

    @Column({ type: 'uuid' })
    snapshot_id: string;

    @Column({ type: 'bigint', nullable: true })
    cancel_reason_id: string | null;

    @Column({ type: 'timestamptz' })
    created_at: Date;

    @Column({ type: 'timestamptz', nullable: true })
    in_process_at: Date | null;

    @Column({ type: 'bigint' })
    order_id: string;

    @Column({ type: 'varchar' })
    order_number: string;

    @Column({ type: 'varchar' })
    posting_number: string;

    @Column({ type: 'varchar' })
    status: string;

    @Column({ type: 'varchar', nullable: true })
    substatus: string | null;

    @OneToMany(() => OzonOrderProductEntity, product => product.order, { cascade: true })
    products: OzonOrderProductEntity[];

    @OneToOne(() => OzonOrderLegalInfoEntity, legal_info => legal_info.order, { cascade: true })
    legal_info: OzonOrderLegalInfoEntity;

    @OneToOne(() => OzonOrderAnalyticsDataEntity, analytics => analytics.order, { cascade: true })
    analytics_data: OzonOrderAnalyticsDataEntity;

    @OneToMany(() => OzonOrderAdditionalDataEntity, additional_data => additional_data.order, { cascade: true })
    additional_data: OzonOrderAdditionalDataEntity[];

    @OneToOne(() => OzonOrderFinancialDataEntity, financial_data => financial_data.order, { cascade: true })
    financial_data: OzonOrderFinancialDataEntity;
}
