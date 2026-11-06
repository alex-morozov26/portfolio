import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OzonProductEntity } from './ozon-product.entity';


@Entity('ozon_product_commissions')
export class OzonProductCommissionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OzonProductEntity, product => product.commissions, { onDelete: 'CASCADE' })
    product: OzonProductEntity;

    @Column({ type: 'float' })
    delivery_amount: number;

    @Column({ type: 'float' })
    percent: number;

    @Column({ type: 'float' })
    return_amount: number;

    @Column({ type: 'varchar' })
    sale_schema: string;

    @Column({ type: 'float' })
    value: number;
}
