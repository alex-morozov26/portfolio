import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { WbPriceSizeEntity } from './wb-price-size.entity';

@Index('idx_wb_prices_ds_nm_snapshot', ['datasource_id', 'nm_id', 'snapshot_id'])
@Entity('wb_prices')
export class WbPriceEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    datasource_id: string;

    @Column({ type: 'uuid' })
    snapshot_id: string;

    @Column({ type: 'bigint' })
    nm_id: string;

    @Column({ type: 'varchar', nullable: true })
    vendor_code: string | null;

    @Column({ type: 'varchar', nullable: true })
    currency_iso_code_4217: string | null;

    @Column({ type: 'int', nullable: true })
    discount: number | null;

    @Column({ type: 'int', nullable: true })
    club_discount: number | null;

    @Column({ type: 'boolean', default: false })
    editable_size_price: boolean;

    @Column({ type: 'boolean', default: false })
    is_bad_turnover: boolean;

    @OneToMany(() => WbPriceSizeEntity, size => size.priceRel, { cascade: true })
    sizes: WbPriceSizeEntity[];
}
