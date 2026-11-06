import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { WbStockMetricEntity } from "./wb-stock-metric.entity";

@Entity('wb_stock_current_prices')
export class WbStockCurrentPriceEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => WbStockMetricEntity, metrics => metrics.current_price, { onDelete: 'CASCADE' })
    @JoinColumn()
    metrics: WbStockMetricEntity;

    @Column({ type: 'bigint' })
    min_price: string;

    @Column({ type: 'bigint' })
    max_price: string;
}