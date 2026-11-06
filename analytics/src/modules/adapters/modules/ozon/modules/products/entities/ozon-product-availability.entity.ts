import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { OzonProductEntity } from './ozon-product.entity';
import { OzonProductAvailabilityReasonEntity } from './ozon-product-availability-reason.entity';


@Entity('ozon_product_availabilities')
export class OzonProductAvailabilityEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OzonProductEntity, product => product.availabilities, { onDelete: 'CASCADE' })
    product: OzonProductEntity;

    @Column({ type: 'varchar' })
    availability: string;

    @Column({ type: 'bigint' })
    sku: string;

    @Column({ type: 'varchar' })
    source: string;

    @OneToMany(() => OzonProductAvailabilityReasonEntity, reason => reason.availability, { cascade: true })
    reasons: OzonProductAvailabilityReasonEntity[];
}
