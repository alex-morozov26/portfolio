import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OzonProductErrorEntity } from './ozon-product-error.entity';


@Entity('ozon_product_error_parameters')
export class OzonProductErrorParameterEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OzonProductErrorEntity, error => error.parameters, { onDelete: 'CASCADE' })
    error: OzonProductErrorEntity;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'text' })
    value: string;
}
