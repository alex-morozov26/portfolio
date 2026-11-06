import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { OzonPriceExternalIndexDataEntity } from './ozon-price-external-index-data.entity';
import { OzonPriceOzonIndexDataEntity } from './ozon-price-ozon-index-data.entity';
import { OzonPriceMarketplacesIndexDataEntity } from './ozon-price-marketplaces-index-data.entity';
import { OzonPriceEntity } from './ozon-price.entity';


@Entity('ozon_price_indexes')
export class OzonPriceIndexEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => OzonPriceEntity, price => price.price_indexes, { onDelete: 'CASCADE' })
    @JoinColumn()
    price: OzonPriceEntity;

    @Column({ type: 'varchar' })
    color_index: string;

    @OneToOne(() => OzonPriceExternalIndexDataEntity, external_index_data => external_index_data.index, { cascade: true })
    external_index_data: OzonPriceExternalIndexDataEntity;

    @OneToOne(() => OzonPriceOzonIndexDataEntity, ozon_index_data => ozon_index_data.index, { cascade: true })
    ozon_index_data: OzonPriceOzonIndexDataEntity;

    @OneToOne(() => OzonPriceMarketplacesIndexDataEntity, marketplaces_index_data => marketplaces_index_data.index, { cascade: true })
    self_marketplaces_index_data: OzonPriceMarketplacesIndexDataEntity;
}
