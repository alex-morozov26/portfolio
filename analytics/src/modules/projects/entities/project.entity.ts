import { DataSourceEntity } from 'src/modules/data-sources/entities/data-source.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany } from 'typeorm';

@Entity('projects')
export class ProjectEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToMany(() => UserEntity, user => user.projects)
    users: UserEntity[];

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;
    
    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @OneToMany(() => DataSourceEntity, data_source => data_source.project, { cascade: true })
    data_sources: DataSourceEntity[];
}