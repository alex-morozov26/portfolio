import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { OzonOrderEntity } from './ozon-order.entity';


@Entity('ozon_order_additional_data')
@Index('idx_ozon_order_additional_data_order_id', ['order'])
export class OzonOrderAdditionalDataEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OzonOrderEntity, order => order.additional_data, { onDelete: 'CASCADE' })
    order: OzonOrderEntity;

    @Column({ type: 'varchar' })
    key: string;

    @Column({ type: 'varchar' })
    value: string;
}
