import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { OzonProductEntity } from './ozon-product.entity';


@Entity('ozon_product_models')
export class OzonProductModelEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => OzonProductEntity, product => product.model, { onDelete: 'CASCADE' })
    @JoinColumn()
    product: OzonProductEntity;

    @Column({ type: 'bigint' })
    count: string;

    @Column({ type: 'bigint' })
    model_id: string;
}
