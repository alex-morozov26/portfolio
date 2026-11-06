import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { OzonOrderEntity } from './ozon-order.entity';


@Entity('ozon_order_products')
@Index('idx_ozon_order_products_order_id', ['order'])
export class OzonOrderProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OzonOrderEntity, order => order.products, { onDelete: 'CASCADE' })
    order: OzonOrderEntity;

    @Column('varchar', { array: true })
    digital_codes: string[];

    @Column({ type: 'varchar' })
    name: string;
    
    @Column({ type: 'varchar' })
    offer_id: string;

    @Column({ type: 'varchar', length: 3 })
    currency_code: string;

    @Column({ type: 'varchar' })
    price: string;

    @Column({ type: 'boolean', default: false })
    is_marketplace_buyout: boolean;

    @Column({ type: 'bigint' })
    quantity: string;

    @Column({ type: 'bigint' })
    sku: string;
}
