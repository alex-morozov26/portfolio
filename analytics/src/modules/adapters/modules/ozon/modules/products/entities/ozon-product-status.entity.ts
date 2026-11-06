import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { OzonProductEntity } from './ozon-product.entity';


@Entity('ozon_product_statuses')
export class OzonProductStatusEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => OzonProductEntity, product => product.statuses, { onDelete: 'CASCADE' })
    @JoinColumn()
    product: OzonProductEntity;

    @Column({ type: 'boolean', default: false })
    is_created: boolean;

    @Column({ type: 'varchar' })
    moderate_status: string;

    @Column({ type: 'varchar' })
    status: string;

    @Column({ type: 'text' })
    status_description: string;

    @Column({ type: 'varchar' })
    status_failed: string;

    @Column({ type: 'varchar' })
    status_name: string;

    @Column({ type: 'text' })
    status_tooltip: string;

    @Column({ type: 'timestamptz' })
    status_updated_at: Date;

    @Column({ type: 'varchar' })
    validation_status: string;
}
