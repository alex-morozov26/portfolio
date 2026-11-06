import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSourceEntity } from '../../../data-sources/entities/data-source.entity';
import { SyncScope } from '../sync-logs/models/sync-scope.enum';

@Injectable()
export class SyncMetaService {
    constructor(
        @InjectRepository(DataSourceEntity)
        private readonly dataSourcesRepository: Repository<DataSourceEntity>
    ) {}

    async updateFullSync(dataSourceId: string, finishedAt: Date) {
        await this.dataSourcesRepository.update(dataSourceId, { last_sync_at: finishedAt });
    }

    async updateScopeSync(dataSourceId: string, scope: SyncScope, finishedAt: Date) {
        const dataSource = await this.dataSourcesRepository.findOne({
            where: { id: dataSourceId },
            select: {
                id: true,
                last_sync_scopes: true
            }
        });

        if (!dataSource) return;

        dataSource.last_sync_scopes = {
            ...(dataSource.last_sync_scopes ?? {}),
            [scope]: finishedAt.toISOString(),
        };

        await this.dataSourcesRepository.save(dataSource);
    }
}
