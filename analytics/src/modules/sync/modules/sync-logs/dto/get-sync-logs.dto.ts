import { IsEnum, IsOptional, IsNumber, IsISO8601, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SyncScope } from '../models/sync-scope.enum';
import { SyncStatus } from '../models/sync-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';

export class GetSyncLogsDto {
    @ApiPropertyOptional({
        description: 'Область синхронизации',
        example: SyncScope.Products,
        enum: SyncScope
    })
    @IsOptional()
    @IsEnum(SyncScope)
    scope?: SyncScope;

    @ApiPropertyOptional({
        description: 'Статус синхронизации',
        example: SyncStatus.Success,
        enum: SyncStatus
    })
    @IsOptional()
    @IsEnum(SyncStatus)
    status?: SyncStatus;

    @ApiPropertyOptional({
        description: 'Режим синхронизации',
        example: SyncMode.Auto,
        enum: SyncMode
    })
    @IsOptional()
    @IsEnum(SyncMode)
    mode?: SyncMode;

    @ApiPropertyOptional({
        description: 'Дата начала выборки в формате ISO 8601',
        example: '2026-01-03T00:00:00Z', type: String
    })
    @IsOptional()
    @IsISO8601()
    dateFrom?: string;

    @ApiPropertyOptional({
        description: 'Дата окончания выборки в формате ISO 8601',
        example: '2026-01-04T00:00:00Z',
        type: String,
    })
    @IsOptional()
    @IsISO8601()
    dateTo?: string;

    @ApiPropertyOptional({
        description: 'Максимальное количество записей в ответе',
        example: 20, default: 100, type: Number
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number;

    @ApiPropertyOptional({ 
        description: 'Количество элементов, которые нужно пропустить с начала списка',
        example: 40, default: 0, type: Number
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    offset?: number;
}
