import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WbProductEntity } from './wb-product.entity';

@Entity('wb_product_photos')
export class WbProductPhotoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => WbProductEntity, product => product.photos, { onDelete: 'CASCADE' })
    product: WbProductEntity;

    @Column({ type: 'varchar', nullable: true })
    big: string | null;

    @Column({ type: 'varchar', nullable: true })
    c246x328: string | null;

    @Column({ type: 'varchar', nullable: true })
    c516x688: string | null;

    @Column({ type: 'varchar', nullable: true })
    square: string | null;

    @Column({ type: 'varchar', nullable: true })
    tm: string | null;
}
