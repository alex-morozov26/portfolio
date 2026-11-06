import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { OzonOrderEntity } from './ozon-order.entity';


@Entity('ozon_order_legal_info')
export class OzonOrderLegalInfoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => OzonOrderEntity, order => order.legal_info, { onDelete: 'CASCADE' })
    @JoinColumn()
    order: OzonOrderEntity;

    @Column({ type: 'varchar' })
    company_name: string;

    @Column({ type: 'varchar' })
    inn: string;

    @Column({ type: 'varchar' })
    kpp: string;
}
