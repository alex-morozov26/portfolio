import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { WbStockMetricEntity } from "./wb-stock-metric.entity";

@Entity('wb_stock_sale_rates')
export class WbStockSaleRateEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => WbStockMetricEntity, metrics => metrics.sale_rate, { onDelete: 'CASCADE' })
    @JoinColumn()
    metrics: WbStockMetricEntity;

    @Column({ type: 'int' })
    days: number;

    @Column({ type: 'int' })
    hours: number;
}