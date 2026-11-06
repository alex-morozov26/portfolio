import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WbProductEntity } from './wb-product.entity';

@Entity('wb_product_tags')
export class WbProductTagEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => WbProductEntity, product => product.tags, { onDelete: 'CASCADE' })
    product: WbProductEntity;

    @Column({ type: 'int' })
    wbTagId: number;

    @Column()
    name: string;

    @Column()
    color: string;
}