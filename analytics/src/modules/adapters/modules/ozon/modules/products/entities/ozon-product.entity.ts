import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, Index } from 'typeorm';
import { OzonProductQuantEntity } from './ozon-product-quant.entity';
import { OzonProductAvailabilityEntity } from './ozon-product-availability.entity';
import { OzonProductCommissionEntity } from './ozon-product-commission.entity';
import { OzonProductErrorEntity } from './ozon-product-error.entity';
import { OzonProductModelEntity } from './ozon-product-model.entity';
import { OzonProductPriceIndexEntity } from './ozon-product-price-index.entity';
import { OzonProductPromotionEntity } from './ozon-product-promotion.entity';
import { OzonProductSourceEntity } from './ozon-product-source.entity';
import { OzonProductStatusEntity } from './ozon-product-status.entity';
import { OzonProductStockEntity } from './ozon-product-stock.entity';
import { OzonProductVisibilityDetailEntity } from './ozon-product-visibility-detail.entity';

@Index('idx_ozon_products_ds_product_snapshot', ['datasource_id', 'product_id', 'snapshot_id'])
@Entity('ozon_products')
export class OzonProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    datasource_id: string;

    @Column({ type: 'uuid' })
    snapshot_id: string;

    @Column({ type: 'boolean', default: false })
    is_archived: boolean;

    @Column({ type: 'boolean', default: false })
    has_fbo_stocks: boolean;

    @Column({ type: 'boolean', default: false })
    has_fbs_stocks: boolean;

    @Column({ type: 'boolean', default: false })
    is_discounted: boolean;

    @Column({ type: 'varchar' })
    offer_id: string;

    @Column({ type: 'bigint' })
    product_id: string;

    @Column('varchar', { array: true })
    barcodes: string[];

    @Column('varchar', { array: true })
    color_image: string[];

    @Column({ type: 'timestamptz' })
    created_at: Date;

    @Column({ type: 'varchar' })
    currency_code: string;

    @Column({ type: 'bigint' })
    description_category_id: string;

    @Column({ type: 'int' })
    discounted_fbo_stocks: number;

    @Column({ type: 'boolean', default: false })
    has_discounted_fbo_item: boolean;

    @Column('varchar', { array: true })
    images: string[];

    @Column('varchar', { array: true })
    images360: string[];

    @Column({ type: 'boolean', default: false })
    is_handarchived: boolean;

    @Column({ type: 'boolean', default: false })
    is_autoarchived: boolean;

    @Column({ type: 'boolean', default: false })
    is_kgt: boolean;

    @Column({ type: 'boolean', default: false })
    is_super: boolean;

    @Column({ type: 'varchar' })
    min_price: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    old_price: string;

    @Column({ type: 'varchar' })
    price: string;

    @Column('varchar', { array: true })
    primary_image: string[];

    @Column({ type: 'bigint' })
    sku: string;

    @Column({ type: 'bigint' })
    type_id: string;

    @Column({ type: 'timestamptz' })
    updated_at: Date;

    @Column({ type: 'varchar' })
    vat: string;

    @Column({ type: 'float' })
    volume_weight: number;

    @OneToMany(() => OzonProductQuantEntity, quant => quant.product, { cascade: true })
    quants: OzonProductQuantEntity[];

    @OneToMany(() => OzonProductAvailabilityEntity, availability => availability.product, { cascade: true })
    availabilities: OzonProductAvailabilityEntity[];

    @OneToMany(() => OzonProductCommissionEntity, commission => commission.product, { cascade: true })
    commissions: OzonProductCommissionEntity[];

    @OneToMany(() => OzonProductErrorEntity, error => error.product, { cascade: true })
    errors: OzonProductErrorEntity[];

    @OneToMany(() => OzonProductPromotionEntity, promotion => promotion.product, { cascade: true })
    promotions: OzonProductPromotionEntity[];

    @OneToMany(() => OzonProductSourceEntity, source => source.product, { cascade: true })
    sources: OzonProductSourceEntity[];

    @OneToOne(() => OzonProductModelEntity, model => model.product, { cascade: true })
    model: OzonProductModelEntity;

    @OneToOne(() => OzonProductPriceIndexEntity, price_indexes => price_indexes.product, { cascade: true })
    price_indexes: OzonProductPriceIndexEntity;

    @OneToOne(() => OzonProductStatusEntity, statuses => statuses.product, { cascade: true })
    statuses: OzonProductStatusEntity;

    @OneToOne(() => OzonProductStockEntity, stocks => stocks.product, { cascade: true })
    stocks: OzonProductStockEntity;

    @OneToOne(() => OzonProductVisibilityDetailEntity, visibility_details => visibility_details.product, { cascade: true })
    visibility_details: OzonProductVisibilityDetailEntity;
}