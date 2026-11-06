import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Index } from 'typeorm';
import { WbProductPhotoEntity } from './wb-product-photo.entity';
import { WbProductWholesaleEntity } from './wb-product-wholesale.entity';
import { WbProductDimensionEntity } from './wb-product-dimension.entity';
import { WbProductCharacteristicEntity } from './wb-product-characteristic.entity';
import { WbProductSizeEntity } from './wb-product-size.entity';
import { WbProductTagEntity } from './wb-product-tag.entity';

@Index('idx_wb_products_ds_nm_snapshot', ['datasource_id', 'nm_id', 'snapshot_id'])
@Entity('wb_products')
export class WbProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    datasource_id: string;

    @Column({ type: 'uuid' })
    snapshot_id: string;

    @Column({ type: 'bigint' })
    nm_id: string;

    @Column({ type: 'bigint', nullable: true })
    imt_id: string | null;

    @Column({ type: 'uuid', nullable: true })
    nm_uuid: string | null;

    @Column({ type: 'int', nullable: true })
    subject_id: number | null;

    @Column({ type: 'varchar', nullable: true })
    subject_name: string | null;

    @Column({ type: 'varchar', nullable: true })
    vendor_code: string | null;

    @Column({ type: 'varchar', nullable: true })
    brand: string | null;

    @Column({ type: 'varchar', nullable: true })
    title: string | null;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'boolean', default: false })
    need_kiz: boolean | null;

    @Column({ type: 'timestamp', nullable: true })
    wb_created_at: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    wb_updated_at: Date | null;

    @Column({ type: 'varchar', nullable: true })
    video: string | null;

    @CreateDateColumn()
    synced_at: Date;

    @OneToMany(() => WbProductPhotoEntity, photo => photo.product, { cascade: true })
    photos: WbProductPhotoEntity[];

    @OneToMany(() => WbProductWholesaleEntity, wholesale => wholesale.product, { cascade: true })
    wholesale: WbProductWholesaleEntity[];

    @OneToMany(() => WbProductDimensionEntity, dimension => dimension.product, { cascade: true })
    dimensions: WbProductDimensionEntity[];

    @OneToMany(() => WbProductCharacteristicEntity, char => char.product, { cascade: true })
    characteristics: WbProductCharacteristicEntity[];

    @OneToMany(() => WbProductSizeEntity, size => size.product, { cascade: true })
    sizes: WbProductSizeEntity[];

    @OneToMany(() => WbProductTagEntity, tag => tag.product, { cascade: true })
    tags: WbProductTagEntity[];
}
