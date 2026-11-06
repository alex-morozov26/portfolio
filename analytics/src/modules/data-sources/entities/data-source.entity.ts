import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { DataSourceType } from '../models/data-source-type.enum';
import { ProjectEntity } from 'src/modules/projects/entities/project.entity';
import { decrypt, encrypt } from 'src/utils/crypto';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';


@Entity('data_sources')
export class DataSourceEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ProjectEntity, project => project.data_sources, { onDelete: 'CASCADE' })
    project: ProjectEntity;

    @Column({ type: 'varchar', length: 20 })
    type: DataSourceType;

    @Column({ type: 'varchar', nullable: true })
    private ozon_client_id: string | null;

    @Column({ type: 'varchar', nullable: true })
    private ozon_api_key: string | null;

    @Column({ type: 'varchar', nullable: true })
    private ozon_performance_client_id: string | null;

    @Column({ type: 'varchar', nullable: true })
    private ozon_performance_client_secret: string | null;

    @Column({ type: 'varchar', nullable: true })
    private wb_api_token: string | null;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @Column({ type: 'timestamptz', nullable: true })
    last_sync_at: Date | null;

    @Column({ type: 'jsonb', nullable: true })
    last_sync_scopes: Partial<Record<SyncScope, string>> | null;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    setOzonClientId(clientId: string) { this.ozon_client_id = encrypt(clientId); }
    getOzonClientId(): string | null { return decrypt(this.ozon_client_id); }

    setOzonApiKey(apiKey: string) { this.ozon_api_key = encrypt(apiKey); }
    getOzonApiKey(): string | null { return decrypt(this.ozon_api_key); }

    setOzonPerformanceClientId(clientId: string) { this.ozon_performance_client_id = encrypt(clientId); }
    getOzonPerformanceClientId(): string | null { return decrypt(this.ozon_performance_client_id); }

    setOzonPerformanceClientSecret(clientSecret: string) { this.ozon_performance_client_secret = encrypt(clientSecret); }
    getOzonPerformanceClientSecret(): string | null { return decrypt(this.ozon_performance_client_secret); }

    setWbApiToken(apiToken: string) { this.wb_api_token = encrypt(apiToken); }
    getWbApiToken(): string | null { return decrypt(this.wb_api_token); }
}