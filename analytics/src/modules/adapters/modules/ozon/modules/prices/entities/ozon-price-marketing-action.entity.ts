import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { OzonPriceMarketingActionDataEntity } from './ozon-price-marketing-action-data.entity';
import { OzonPriceEntity } from './ozon-price.entity';


@Entity('ozon_price_marketing_actions')
export class OzonPriceMarketingActionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => OzonPriceEntity, price => price.marketing_actions, { onDelete: 'CASCADE' })
    @JoinColumn()
    price: OzonPriceEntity;

    @Column({ type: 'timestamptz' })
    current_period_from: Date;

    @Column({ type: 'timestamptz' })
    current_period_to: Date;

    @Column({ type: 'boolean', default: false })
    ozon_actions_exist: boolean;

    @OneToMany(() => OzonPriceMarketingActionDataEntity, action => action.priceMarketing, { cascade: true })
    actions: OzonPriceMarketingActionDataEntity[];
}
