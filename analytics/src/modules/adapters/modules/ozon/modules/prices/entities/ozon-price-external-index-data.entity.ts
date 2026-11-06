import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { OzonPriceIndexEntity } from './ozon-price-index.entity';


@Entity('ozon_price_external_index_data')
export class OzonPriceExternalIndexDataEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => OzonPriceIndexEntity, index => index.external_index_data, { onDelete: 'CASCADE' })
    @JoinColumn()
    index: OzonPriceIndexEntity;

    @Column({ type: 'float' })
    min_price: number;

    @Column({ type: 'varchar', length: 3 })
    min_price_currency: string;

    @Column({ type: 'float' })
    price_index_value: number;
}
