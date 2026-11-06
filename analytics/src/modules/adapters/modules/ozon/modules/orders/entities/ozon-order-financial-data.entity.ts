import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { OzonOrderFinancialDataProductEntity } from './ozon-order-financial-data-product.entity';
import { OzonOrderEntity } from './ozon-order.entity';


@Entity('ozon_order_financial_data')
export class OzonOrderFinancialDataEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => OzonOrderEntity, order => order.financial_data, { onDelete: 'CASCADE' })
    @JoinColumn()
    order: OzonOrderEntity;

    @Column({ type: 'varchar' })
    cluster_from: string;

    @Column({ type: 'varchar' })
    cluster_to: string;

    @OneToMany(() => OzonOrderFinancialDataProductEntity, product => product.financial_data, { cascade: true })
    products: OzonOrderFinancialDataProductEntity[];
}
