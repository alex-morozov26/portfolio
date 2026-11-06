import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OzonPriceMarketingActionEntity } from './ozon-price-marketing-action.entity';


@Entity('ozon_price_marketing_action_data')
export class OzonPriceMarketingActionDataEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OzonPriceMarketingActionEntity, priceMarketing => priceMarketing.actions, { onDelete: 'CASCADE' })
    priceMarketing: OzonPriceMarketingActionEntity;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'int' })
    value: number;

    @Column({ type: 'timestamptz' })
    date_from: Date;

    @Column({ type: 'timestamptz' })
    date_to: Date;
}
