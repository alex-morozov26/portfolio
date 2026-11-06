import { DataSourceType } from "src/modules/data-sources/models/data-source-type.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SyncScope } from "../models/sync-scope.enum";
import { SyncMode } from "src/modules/adapters/models/sync-mode.enum";
import { SyncStatus } from "../models/sync-status.enum";
import { SyncError } from "../models/sync-error.interface";


@Entity({ name: 'sync_logs' })
export class SyncLogEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    data_source_id: string;

    @Column({ type: 'uuid', array: true })
    snapshot_ids: string[];

    @Column({ type: 'varchar', length: 20 })
    type: DataSourceType;

    @Column({ type: 'varchar', length: 30 })
    scope: SyncScope;

    @Column({ type: 'varchar', length: 10 })
    mode: SyncMode;

    @Column({ type: 'varchar', length: 10 })
    status: SyncStatus;

    @CreateDateColumn({ type: 'timestamptz' })
    started_at: Date;

    @Column({ type: 'timestamptz', nullable: true })
    finished_at: Date | null;

    @Column({ type: 'jsonb', default: () => "'[]'" })
    errors: SyncError[];
}