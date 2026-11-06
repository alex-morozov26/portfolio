import { ApiProperty } from '@nestjs/swagger';
import { DataSourceType } from 'src/modules/data-sources/models/data-source-type.enum';
import { SyncScope } from '../models/sync-scope.enum';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { SyncStatus } from '../models/sync-status.enum';
import { SyncErrorViewDto } from './sync-error-view.dto';
import { SyncLogEntity } from '../entities/sync-log.entity';

export class SyncLogViewDto {
    constructor(entity: SyncLogEntity) {
        this.id = entity.id;
        this.data_source_id = entity.data_source_id;
        this.snapshots_ids = entity.snapshot_ids;
        this.type = entity.type;
        this.scope = entity.scope;
        this.mode = entity.mode;
        this.status = entity.status;
        this.started_at = entity.started_at;
        this.finished_at = entity.finished_at;
        this.errors = entity.errors.map(error => new SyncErrorViewDto(error));
    }

    @ApiProperty({ description: 'Уникальный ID записи', type: String, example: 'e9b79377-fa08-4484-bc8c-d1f180c61e73' })
    id: string;

    @ApiProperty({ description: 'ID источника данных', type: String, example: 'e7c4a9d2-5b81-4f6e-9c3a-8d2f1b6e4a90' })
    data_source_id: string;

    @ApiProperty({ description: 'ID снимков синхронизации', type: [String], example: ['c4ac2a8c-2846-4572-8d5a-4170090f7d0c'] })
    snapshots_ids: string[];

    @ApiProperty({ description: 'Тип источника данных', enum: DataSourceType, example: DataSourceType.Wb })
    type: DataSourceType;

    @ApiProperty({ description: 'Область синхронизации', enum: SyncScope, example: SyncScope.Warehouses })
    scope: SyncScope;

    @ApiProperty({ description: 'Режим синхронизации', enum: SyncMode, example: SyncMode.Force })
    mode: SyncMode;

    @ApiProperty({ description: 'Статус синхронизации', enum: SyncStatus, example: SyncStatus.Failed })
    status: SyncStatus;

    @ApiProperty({ description: 'Дата начала синхронизации в формате ISO 8601', type: String, example: '2026-01-03T01:17:47.130Z' })
    started_at: Date;

    @ApiProperty({ description: 'Дата окончания синхронизации в формате ISO 8601', type: String, example: '2026-01-03T01:17:47.145Z', nullable: true })
    finished_at: Date | null;

    @ApiProperty({
        description: 'Список ошибок синхронизации', type: [SyncErrorViewDto],
        example: [
            {
                scope: SyncScope.Warehouses,
                message: 'Синхронизация складов не реализована для WB!'
            }
        ]
    })
    errors: SyncErrorViewDto[];
}
