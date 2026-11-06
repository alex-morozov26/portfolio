import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WbProductEntity } from './wb-product.entity';

@Entity('wb_product_sizes')
export class WbProductSizeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => WbProductEntity, product => product.sizes, { onDelete: 'CASCADE' })
    product: WbProductEntity;

    @Column({ type: 'int', nullable: true })
    chrtID: number | null;

    @Column({ type: 'varchar', nullable: true })
    techSize: string | null;

    @Column({ type: 'varchar', nullable: true })
    wbSize: string | null;

    @Column('text', { array: true, nullable: true })
    skus: string[] | null;
}