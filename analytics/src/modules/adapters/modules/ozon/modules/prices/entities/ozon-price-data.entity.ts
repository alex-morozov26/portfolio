import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { OzonPriceEntity } from './ozon-price.entity';


@Entity('ozon_price_data')
export class OzonPriceDataEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => OzonPriceEntity, priceRel => priceRel.price, { onDelete: 'CASCADE' })
    @JoinColumn()
    priceRel: OzonPriceEntity;

    @Column({ type: 'boolean', default: false })
    auto_action_enabled: boolean;

    @Column({ type: 'boolean', default: false })
    auto_add_to_ozon_actions_list_enabled: boolean;

    @Column({ type: 'varchar', length: 3 })
    currency_code: string;

    @Column({ type: 'float' })
    marketing_seller_price: number;

    @Column({ type: 'float' })
    min_price: number;

    @Column({ type: 'float' })
    net_price: number;

    @Column({ type: 'float' })
    old_price: number;

    @Column({ type: 'float' })
    price: number;

    @Column({ type: 'float' })
    retail_price: number;

    @Column({ type: 'float' })
    vat: number;
}
