import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { OzonOrderFinancialDataEntity } from './ozon-order-financial-data.entity';


@Entity('ozon_order_financial_data_products')
@Index('idx_ozon_financial_data_products_financial_id', ['financial_data'])
export class OzonOrderFinancialDataProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OzonOrderFinancialDataEntity, financial_data => financial_data.products, { onDelete: 'CASCADE' })
    financial_data: OzonOrderFinancialDataEntity;

    @Column('varchar', { array: true })
    actions: string[];

    @Column({ type: 'varchar', length: 3 })
    currency_code: string;

    @Column({ type: 'float' })
    commission_amount: number;

    @Column({ type: 'bigint' })
    commission_percent: string;

    @Column({ type: 'varchar', length: 3, nullable: true })
    commissions_currency_code: string | null;

    @Column({ type: 'float' })
    old_price: number;

    @Column({ type: 'float' })
    payout: number;

    @Column({ type: 'float' })
    price: number;

    @Column({ type: 'bigint' })
    product_id: string;

    @Column({ type: 'bigint', nullable: true })
    quantity: string | null;

    @Column({ type: 'float' })
    total_discount_percent: number;

    @Column({ type: 'float' })
    total_discount_value: number;
}
