import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { SyncSnapshotEntity } from './entities/sync-snapshot.entity';
import { SyncScope } from '../sync-logs/models/sync-scope.enum';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { SyncSnapshotStatus } from './models/sync-snapshot-status.enum';

@Injectable()
export class SyncSnapshotsService {
    private readonly logger = new Logger(SyncSnapshotsService.name);

    constructor(private readonly dataSource: DataSource) { }

    async create(datasource_id: string, scope: SyncScope, mode: SyncMode): Promise<SyncSnapshotEntity> {
        const repo = this.dataSource.getRepository(SyncSnapshotEntity);
        const snapshot = repo.create({
            datasource_id: datasource_id,
            scope: scope,
            mode: mode,
            status: SyncSnapshotStatus.Loading
        });
        return repo.save(snapshot);
    }

    async fail(snapshot_id: string) {
        await this.dataSource.getRepository(SyncSnapshotEntity).update(snapshot_id, { status: SyncSnapshotStatus.Failed });
        this.logger.warn(`Снапшот ${snapshot_id} помечен как неисправный!`);
    }

    async activate(manager: EntityManager, snapshot_id: string): Promise<void> {
        const snapshotRepo = manager.getRepository(SyncSnapshotEntity);
        await snapshotRepo.update(snapshot_id, { status: SyncSnapshotStatus.Active });
        this.logger.log(`Снапшот ${snapshot_id} помечен как активный!`);
    }

    async archive(manager: EntityManager, snapshot_id: string): Promise<void> {
        const snapshotRepo = manager.getRepository(SyncSnapshotEntity);
        await snapshotRepo.update(snapshot_id, { status: SyncSnapshotStatus.Archived });
        this.logger.log(`Снапшот ${snapshot_id} помечен как архивный!`);
    }

    async getActive(datasource_id: string, scope: SyncScope): Promise<SyncSnapshotEntity | null> {
        return this.dataSource.getRepository(SyncSnapshotEntity).findOne({
            where: { datasource_id, scope, status: SyncSnapshotStatus.Active },
        });
    }

    async getLoading(datasource_id: string, scope: SyncScope): Promise<SyncSnapshotEntity[]> {
        return this.dataSource.getRepository(SyncSnapshotEntity).find({
            where: { datasource_id, scope, status: SyncSnapshotStatus.Loading }
        })
    }
}
