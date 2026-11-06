import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OzonProductStockEntity } from './ozon-product-stock.entity';


@Entity('ozon_product_stock_data')
export class OzonProductStockDataEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OzonProductStockEntity, productStock => productStock.stocks, { onDelete: 'CASCADE' })
    productStock: OzonProductStockEntity;

    @Column({ type: 'int' })
    present: number;
    
    @Column({ type: 'int' })
    reserved: number;

    @Column({ type: 'bigint' })
    sku: string;

    @Column({ type: 'varchar' })
    source: string;
}
