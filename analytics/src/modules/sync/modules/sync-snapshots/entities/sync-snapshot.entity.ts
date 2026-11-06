import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { SyncScope } from '../../sync-logs/models/sync-scope.enum';
import { SyncSnapshotStatus } from '../models/sync-snapshot-status.enum';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';

@Index('idx_snapshot_active', ['datasource_id', 'scope', 'status'])
@Entity('sync_snapshots')
export class SyncSnapshotEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    datasource_id: string;

    @Column({ type: 'varchar', length: 30 })
    scope: SyncScope;

    @Column({ type: 'varchar', length: 10 })
    status: SyncSnapshotStatus;

    @Column({ type: 'varchar', length: 10 })
    mode: SyncMode;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
