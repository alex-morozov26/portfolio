import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WbStockMetricEntity } from "./wb-stock-metric.entity";

@Entity('wb_stock_avg_orders_month')
@Index('idx_wb_stock_avg_orders_month_metric_id', ['metrics'])
export class WbStockAvgOrdersMonthEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => WbStockMetricEntity, metric => metric.avg_orders_by_month, {
        onDelete: 'CASCADE',
    })
    metrics: WbStockMetricEntity;

    @Column({ type: 'date' })
    start: string;

    @Column({ type: 'date' })
    end: string;

    @Column({ type: 'float' })
    value: number;
}