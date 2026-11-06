import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { OzonPriceEntity } from './ozon-price.entity';


@Entity('ozon_price_commissions')
export class OzonPriceCommissionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @OneToOne(() => OzonPriceEntity, price => price.commissions, { onDelete: 'CASCADE' })
    @JoinColumn()
    price: OzonPriceEntity;

    @Column({ type: 'float' })
    fbo_deliv_to_customer_amount: number;

    @Column({ type: 'float' })
    fbo_direct_flow_trans_max_amount: number;

    @Column({ type: 'float' })
    fbo_direct_flow_trans_min_amount: number;

    @Column({ type: 'float' })
    fbo_return_flow_amount: number;

    @Column({ type: 'float' })
    fbs_deliv_to_customer_amount: number;

    @Column({ type: 'float' })
    fbs_direct_flow_trans_max_amount: number;

    @Column({ type: 'float' })
    fbs_direct_flow_trans_min_amount: number;

    @Column({ type: 'float' })
    fbs_first_mile_max_amount: number;

    @Column({ type: 'float' })
    fbs_first_mile_min_amount: number;

    @Column({ type: 'float' })
    fbs_return_flow_amount: number;

    @Column({ type: 'float' })
    sales_percent_fbo: number;

    @Column({ type: 'float' })
    sales_percent_fbp: number;

    @Column({ type: 'float' })
    sales_percent_fbs: number;

    @Column({ type: 'float' })
    sales_percent_rfbs: number;
}
