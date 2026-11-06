import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { WbStockMetricEntity } from "./wb-stock-metric.entity";

@Entity('wb_stock_avg_stock_turnovers')
export class WbStockAvgStockTurnoverEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => WbStockMetricEntity, metrics => metrics.avg_stock_turnover, { onDelete: 'CASCADE' })
    @JoinColumn()
    metrics: WbStockMetricEntity;

    @Column({ type: 'int' })
    days: number;

    @Column({ type: 'int' })
    hours: number;
}