import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OzonProductAvailabilityEntity } from './ozon-product-availability.entity';


@Entity('ozon_product_availability_reasons')
export class OzonProductAvailabilityReasonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OzonProductAvailabilityEntity, availability => availability.reasons, { onDelete: 'CASCADE' })
    availability: OzonProductAvailabilityEntity;

    @Column({ type: 'text' })
    text: string;

    @Column({ type: 'bigint' })
    code: string;
}
