import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncMode } from '../../../adapters/models/sync-mode.enum';
import { SyncLogEntity } from './entities/sync-log.entity';
import { SyncScope } from './models/sync-scope.enum';
import { SyncStatus } from './models/sync-status.enum';
import { DataSourceType } from '../../../data-sources/models/data-source-type.enum';
import { SyncError } from './models/sync-error.interface';
import { AccessService } from 'src/modules/access/access.service';
import { GetSyncLogsDto } from './dto/get-sync-logs.dto';
import { ProjectEntity } from 'src/modules/projects/entities/project.entity';
import { DataSourceEntity } from 'src/modules/data-sources/entities/data-source.entity';
import { SelectQueryBuilder } from 'typeorm/browser';

@Injectable()
export class SyncLogsService {
    constructor(
        @InjectRepository(SyncLogEntity)
        private readonly syncLogsRepository: Repository<SyncLogEntity>,
        @InjectRepository(ProjectEntity)
        private readonly projectsRepository: Repository<ProjectEntity>,
        @InjectRepository(DataSourceEntity)
        private readonly dataSourcesRepository: Repository<DataSourceEntity>,
        private readonly accessService: AccessService
    ) {}

    async getLogsForUser(userId: string, params: GetSyncLogsDto) {
        const projects = await this.projectsRepository
            .createQueryBuilder('project')
            .innerJoin('project.users', 'user', 'user.id = :userId', { userId })
            .select(['project.id'])
            .getMany();

        if (!projects.length) return [];

        const projectIds = projects.map(p => p.id);

        const dataSources = await this.dataSourcesRepository
            .createQueryBuilder('ds')
            .where('ds.projectId IN (:...projectIds)', { projectIds })
            .select(['ds.id'])
            .getMany();

        if (!dataSources.length) return [];

        const dataSourceIds = dataSources.map(ds => ds.id);

        let qb = this.syncLogsRepository
            .createQueryBuilder('log')
            .where('log.data_source_id IN (:...dataSourceIds)', { dataSourceIds });

        return this.buildQuery(qb, params).getMany();
    }

    async getLogsForProject(username: string, projectId: string, params: GetSyncLogsDto) {
        await this.accessService.checkAccessByProject(projectId, username);

        const qb = this.syncLogsRepository
            .createQueryBuilder('log')
            .innerJoin('data_sources', 'ds', 'ds.id = log.data_source_id')
            .where('ds.projectId = :projectId', { projectId });

        return this.buildQuery(qb, params).getMany();
    }

    async getLogsForDataSource(username: string, dataSourceId: string, params: GetSyncLogsDto) {
        await this.accessService.checkAccessByDataSource(dataSourceId, username);

        const qb = this.syncLogsRepository
            .createQueryBuilder('log')
            .where('log.data_source_id = :dataSourceId', { dataSourceId });

        return this.buildQuery(qb, params).getMany();
    }

    private buildQuery(
        qb: SelectQueryBuilder<SyncLogEntity>,
        params: GetSyncLogsDto
    ): SelectQueryBuilder<SyncLogEntity> {
        if (params.scope) {
            qb = qb.andWhere('log.scope = :scope', { scope: params.scope });
        }

        if (params.status) {
            qb = qb.andWhere('log.status = :status', { status: params.status });
        }

        if (params.mode) {
            qb = qb.andWhere('log.mode = :mode', { mode: params.mode });
        }

        if (params.dateFrom) {
            qb = qb.andWhere('log.started_at >= :from', { from: params.dateFrom });
        }

        if (params.dateTo) {
            qb = qb.andWhere('log.started_at <= :to', { to: params.dateTo });
        }

        qb = qb.orderBy('log.started_at', 'DESC');

        const limit = params.limit ?? 100;
        const offset = params.offset ?? 0;
        qb = qb.take(limit).skip(offset);

        return qb;
    }

    async start(scope: SyncScope, dataSourceId: string, type: DataSourceType, mode: SyncMode) {
        const log = this.syncLogsRepository.create({
            scope,
            data_source_id: dataSourceId,
            snapshot_ids: [],
            type,
            mode,
            status: SyncStatus.Running,
            errors: []
        });
        return this.syncLogsRepository.save(log);
    }

    async success(id: string, snapshotIds: string[]): Promise<Date> {
        const finishedAt = new Date();

        await this.syncLogsRepository.update(id, {
            status: SyncStatus.Success,
            finished_at: finishedAt,
            snapshot_ids: snapshotIds
        });

        return finishedAt
    }

    async fail(id: string, snapshotIds: string[], errors: SyncError[]) {
        return this.syncLogsRepository.update(id, {
            status: SyncStatus.Failed,
            finished_at: new Date(),
            snapshot_ids: snapshotIds,
            errors: errors
        });
    }
}
