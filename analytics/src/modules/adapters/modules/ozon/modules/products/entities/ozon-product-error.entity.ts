import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { OzonProductEntity } from './ozon-product.entity';
import { OzonProductErrorParameterEntity } from './ozon-product-error-parameter.entity';


@Entity('ozon_product_errors')
export class OzonProductErrorEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OzonProductEntity, product => product.errors, { onDelete: 'CASCADE' })
    product: OzonProductEntity;

    @Column({ type: 'bigint' })
    attribute_id: string;

    @Column({ type: 'varchar' })
    code: string;

    @Column({ type: 'varchar' })
    field: string;

    @Column({ type: 'varchar' })
    level: string;

    @Column({ type: 'varchar' })
    state: string;

    @Column({ type: 'varchar' })
    attribute_name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'varchar' })
    hint_code: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'text' })
    short_description: string;

    @OneToMany(() => OzonProductErrorParameterEntity, parameter => parameter.error, { cascade: true })
    parameters: OzonProductErrorParameterEntity[];
}
