import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { OzonProductPriceIndexEntity } from './ozon-product-price-index.entity';


@Entity('ozon_product_price_external_index_data')
export class OzonProductPriceExternalIndexDataEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => OzonProductPriceIndexEntity, index => index.external_index_data, { onDelete: 'CASCADE' })
    @JoinColumn()
    index: OzonProductPriceIndexEntity;

    @Column({ type: 'varchar' })
    minimal_price: string;

    @Column({ type: 'varchar' })
    minimal_price_currency: string;

    @Column({ type: 'float' })
    price_index_value: number;
}
