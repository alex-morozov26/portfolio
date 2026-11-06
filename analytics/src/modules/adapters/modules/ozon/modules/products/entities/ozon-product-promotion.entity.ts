import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OzonProductEntity } from './ozon-product.entity';


@Entity('ozon_product_promotions')
export class OzonProductPromotionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OzonProductEntity, product => product.promotions, { onDelete: 'CASCADE' })
    product: OzonProductEntity;

    @Column({ type: 'boolean', default: false })
    is_enabled: boolean;

    @Column({ type: 'varchar' })
    type: string;
}
