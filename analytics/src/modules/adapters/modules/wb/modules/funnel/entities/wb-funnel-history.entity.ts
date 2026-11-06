import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WbFunnelEntity } from "./wb-funnel.entity";

@Entity('wb_funnel_history')
export class WbFunnelHistoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => WbFunnelEntity, funnel => funnel.history, {
        onDelete: 'CASCADE',
    })
    funnel: WbFunnelEntity;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'int' })
    open_count: number;

    @Column({ type: 'int' })
    cart_count: number;

    @Column({ type: 'int' })
    order_count: number;

    @Column({ type: 'int' })
    order_sum: number;

    @Column({ type: 'int' })
    buyout_count: number;

    @Column({ type: 'int' })
    buyout_sum: number;

    @Column({ type: 'int' })
    buyout_percent: number;

    @Column({ type: 'int' })
    add_to_cart_conversion: number;

    @Column({ type: 'int' })
    cart_to_order_conversion: number;

    @Column({ type: 'int' })
    add_to_wishlist_count: number;
}
