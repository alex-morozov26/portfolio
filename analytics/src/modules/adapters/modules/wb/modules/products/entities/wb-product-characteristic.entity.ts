import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WbProductEntity } from './wb-product.entity';

@Entity('wb_product_characteristics')
export class WbProductCharacteristicEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => WbProductEntity, product => product.characteristics, { onDelete: 'CASCADE' })
    product: WbProductEntity;

    @Column({ type: 'varchar', nullable: true })
    name: string | null;

    @Column({ type: 'jsonb', nullable: true })
    value: any | null;
}
