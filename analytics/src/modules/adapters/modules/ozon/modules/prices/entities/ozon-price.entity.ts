import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { OzonPriceCommissionEntity } from './ozon-price-commission.entity';
import { OzonPriceMarketingActionEntity } from './ozon-price-marketing-action.entity';
import { OzonPriceDataEntity } from './ozon-price-data.entity';
import { OzonPriceIndexEntity } from './ozon-price-index.entity';

@Index('idx_ozon_prices_ds_product_snapshot', ['datasource_id', 'product_id', 'snapshot_id'])
@Entity('ozon_prices')
export class OzonPriceEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    datasource_id: string;

    @Column({ type: 'uuid' })
    snapshot_id: string;

    @Column({ type: 'float' })
    acquiring: number;

    @Column({ type: 'varchar' })
    offer_id: string;

    @Column({ type: 'bigint' })
    product_id: string;

    @Column({ type: 'float' })
    volume_weight: number;

    @OneToOne(() => OzonPriceCommissionEntity, commissions => commissions.price, { cascade: true })
    commissions: OzonPriceCommissionEntity;

    @OneToOne(() => OzonPriceMarketingActionEntity, marketing_actions => marketing_actions.price, { cascade: true })
    marketing_actions: OzonPriceMarketingActionEntity;

    @OneToOne(() => OzonPriceDataEntity, price => price.priceRel, { cascade: true })
    price: OzonPriceDataEntity;

    @OneToOne(() => OzonPriceIndexEntity, price_indexes => price_indexes.price, { cascade: true })
    price_indexes: OzonPriceIndexEntity;
}
