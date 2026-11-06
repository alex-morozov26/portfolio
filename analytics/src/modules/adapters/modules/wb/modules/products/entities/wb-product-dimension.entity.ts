import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WbProductEntity } from './wb-product.entity';

@Entity('wb_product_dimensions')
export class WbProductDimensionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => WbProductEntity, product => product.dimensions, { onDelete: 'CASCADE' })
    product: WbProductEntity;

    @Column({ type: 'int', nullable: true })
    length: number | null;

    @Column({ type: 'int', nullable: true })
    width: number | null;

    @Column({ type: 'int', nullable: true })
    height: number | null;

    @Column({ type: 'decimal', precision: 8, scale: 3, nullable: true })
    weightBrutto: number | null;

    @Column({ default: true })
    isValid: boolean;
}
