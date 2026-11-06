import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { OzonProductEntity } from './ozon-product.entity';
import { OzonProductPriceExternalIndexDataEntity } from './ozon-product-price-external-index-data.entity';
import { OzonProductPriceOzonIndexDataEntity } from './ozon-product-price-ozon-index-data.entity';
import { OzonProductPriceMarketplacesIndexDataEntity } from './ozon-product-price-marketplaces-index-data.entity';


@Entity('ozon_product_price_indexes')
export class OzonProductPriceIndexEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => OzonProductEntity, product => product.price_indexes, { onDelete: 'CASCADE' })
    @JoinColumn()
    product: OzonProductEntity;

    @Column({ type: 'varchar' })
    color_index: string;

    @OneToOne(() => OzonProductPriceExternalIndexDataEntity, external_index_data => external_index_data.index, { cascade: true })
    external_index_data: OzonProductPriceExternalIndexDataEntity;

    @OneToOne(() => OzonProductPriceOzonIndexDataEntity, ozon_index_data => ozon_index_data.index, { cascade: true })
    ozon_index_data: OzonProductPriceOzonIndexDataEntity;

    @OneToOne(() => OzonProductPriceMarketplacesIndexDataEntity, marketplaces_index_data => marketplaces_index_data.index, { cascade: true })
    self_marketplaces_index_data: OzonProductPriceMarketplacesIndexDataEntity;
}
