import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OzonProductEntity } from './ozon-product.entity';


@Entity('ozon_product_sources')
export class OzonProductSourceEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OzonProductEntity, product => product.sources, { onDelete: 'CASCADE' })
    product: OzonProductEntity;

    @Column({ type: 'timestamptz' })
    created_at: Date;

    @Column({ type: 'text' })
    quant_code: string;

    @Column({ type: 'varchar' })
    shipment_type: string;

    @Column({ type: 'bigint' })
    sku: string;

    @Column({ type: 'varchar' })
    source: string;
}
