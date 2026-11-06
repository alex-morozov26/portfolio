import { ProjectEntity } from 'src/modules/projects/entities/project.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password_hash: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @Column({ type: 'varchar', nullable: true })
    refresh_token: string | null;

    @ManyToMany(() => ProjectEntity, project => project.users)
    @JoinTable({ name: 'project_users' })
    projects: ProjectEntity[];
}