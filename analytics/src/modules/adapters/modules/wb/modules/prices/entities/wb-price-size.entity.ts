import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WbPriceEntity } from './wb-price.entity';

@Entity('wb_price_sizes')
export class WbPriceSizeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => WbPriceEntity, price => price.sizes, { onDelete: 'CASCADE' })
    priceRel: WbPriceEntity;

    @Column({ type: 'int' })
    sizeID: number;

    @Column({ type: 'int' })
    price: number;

    @Column({ type: 'numeric' })
    discountedPrice: number;

    @Column({ type: 'numeric' })
    clubDiscountedPrice: number;

    @Column({ type: 'varchar' })
    techSizeName: string;
}