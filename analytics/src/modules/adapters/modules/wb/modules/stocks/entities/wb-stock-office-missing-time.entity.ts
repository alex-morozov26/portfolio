import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { WbStockMetricEntity } from "./wb-stock-metric.entity";

@Entity('wb_stock_office_missing_times')
export class WbStockOfficeMissingTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => WbStockMetricEntity, metrics => metrics.office_missing_time, { onDelete: 'CASCADE' })
    @JoinColumn()
    metrics: WbStockMetricEntity;

    @Column({ type: 'int' })
    days: number;

    @Column({ type: 'int' })
    hours: number;
}