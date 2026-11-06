import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { WbStockEntity } from "./wb-stock.entity";
import { WbStockAvgOrdersMonthEntity } from "./wb-stock-avg-orders-month.entity";
import { WbStockCurrentPriceEntity } from "./wb-stock-current-price.entity";
import { WbStockSaleRateEntity } from "./wb-stock-sale-rate.entity";
import { WbStockAvgStockTurnoverEntity } from "./wb-stock-avg-stock-turnover.entity";
import { WbStockOfficeMissingTimeEntity } from "./wb-stock-office-missing-time.entity";

@Entity('wb_stock_metrics')
export class WbStockMetricEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => WbStockEntity, stock => stock.metrics, { onDelete: 'CASCADE' })
    @JoinColumn()
    stock: WbStockEntity;

    @Column({ type: 'bigint' })
    orders_count: string;

    @Column({ type: 'bigint' })
    orders_sum: string;

    @Column({ type: 'float' })
    avg_orders: number;

    @Column({ type: 'bigint' })
    buyout_count: string;

    @Column({ type: 'bigint' })
    buyout_sum: string;

    @Column({ type: 'int' })
    buyout_percent: number;

    @Column({ type: 'bigint' })
    stock_count: string;

    @Column({ type: 'bigint' })
    stock_sum: string;

    @Column({ type: 'bigint' })
    to_client_count: string;

    @Column({ type: 'bigint' })
    from_client_count: string;

    @Column({ type: 'float' })
    lost_orders_count: number;
    
    @Column({ type: 'float' })
    lost_orders_sum: number;
    
    @Column({ type: 'float' })
    lost_buyouts_count: number;
    
    @Column({ type: 'float' })
    lost_buyouts_sum: number;

    @Column({ type: 'varchar' })
    availability: string;

    @OneToMany(() => WbStockAvgOrdersMonthEntity, avg_orders_by_month => avg_orders_by_month.metrics, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    avg_orders_by_month: WbStockAvgOrdersMonthEntity[];

    @OneToOne(() => WbStockSaleRateEntity, current_price => current_price.metrics, { cascade: true })
    sale_rate: WbStockSaleRateEntity;

    @OneToOne(() => WbStockAvgStockTurnoverEntity, current_price => current_price.metrics, { cascade: true })
    avg_stock_turnover: WbStockAvgStockTurnoverEntity;

    @OneToOne(() => WbStockOfficeMissingTimeEntity, current_price => current_price.metrics, { cascade: true })
    office_missing_time: WbStockOfficeMissingTimeEntity;

    @OneToOne(() => WbStockCurrentPriceEntity, current_price => current_price.metrics, { cascade: true })
    current_price: WbStockCurrentPriceEntity;
}
