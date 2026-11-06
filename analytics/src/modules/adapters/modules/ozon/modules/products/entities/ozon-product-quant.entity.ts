import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OzonProductEntity } from './ozon-product.entity';


@Entity('ozon_product_quants')
export class OzonProductQuantEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OzonProductEntity, product => product.quants, { onDelete: 'CASCADE' })
    product: OzonProductEntity;

    @Column({ type: 'varchar' })
    quant_code: string;

    @Column({ type: 'bigint' })
    quant_size: string;
}
