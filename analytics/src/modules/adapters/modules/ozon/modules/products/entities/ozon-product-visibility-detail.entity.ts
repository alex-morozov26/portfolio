import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { OzonProductEntity } from './ozon-product.entity';


@Entity('ozon_product_visibility_details')
export class OzonProductVisibilityDetailEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => OzonProductEntity, product => product.visibility_details, { onDelete: 'CASCADE' })
    @JoinColumn()
    product: OzonProductEntity;

    @Column({ type: 'boolean', default: false })
    has_price: boolean;

    @Column({ type: 'boolean', default: false })
    has_stock: boolean;
}
