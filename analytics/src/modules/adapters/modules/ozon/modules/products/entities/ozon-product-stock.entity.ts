import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { OzonProductStockDataEntity } from './ozon-product-stock-data.entity';
import { OzonProductEntity } from './ozon-product.entity';


@Entity('ozon_product_stocks')
export class OzonProductStockEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => OzonProductEntity, product => product.stocks, { onDelete: 'CASCADE' })
    @JoinColumn()
    product: OzonProductEntity;

    @Column({ type: 'boolean', default: false })
    has_stock: boolean;

    @OneToMany(() => OzonProductStockDataEntity, stock => stock.productStock, { cascade: true })
    stocks: OzonProductStockDataEntity[];
}
