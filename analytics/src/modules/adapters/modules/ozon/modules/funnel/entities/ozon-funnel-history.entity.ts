import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OzonFunnelEntity } from './ozon-funnel.entity';


@Entity('ozon_funnel_history')
export class OzonFunnelHistoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OzonFunnelEntity, funnel => funnel.history, { onDelete: 'CASCADE' })
    funnel: OzonFunnelEntity;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'float' })
    revenue: number;

    @Column({ type: 'int' })
    ordered_units: number;

    @Column({ type: 'int' })
    hits_view: number;

    @Column({ type: 'int' })
    hits_view_search: number;

    @Column({ type: 'int' })
    hits_view_pdp: number;

    @Column({ type: 'int' })
    hits_tocart: number;

    @Column({ type: 'int' })
    hits_tocart_search: number;

    @Column({ type: 'int' })
    hits_tocart_pdp: number;

    @Column({ type: 'int' })
    session_view: number;

    @Column({ type: 'int' })
    session_view_search: number;

    @Column({ type: 'int' })
    session_view_pdp: number;

    @Column({ type: 'int' })
    returns: number;

    @Column({ type: 'int' })
    cancellations: number;

    @Column({ type: 'float' })
    position_category: number;
}
