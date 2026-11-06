import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WbProductEntity } from './wb-product.entity';

@Entity('wb_product_wholesales')
export class WbProductWholesaleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => WbProductEntity, product => product.wholesale, { onDelete: 'CASCADE' })
    product: WbProductEntity;

    @Column({ default: false })
    enabled: boolean;

    @Column({ type: 'bigint', nullable: true })
    quantum: string | null;
}