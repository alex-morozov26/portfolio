import { ApiProperty } from "@nestjs/swagger";
import { DataSourceEntity } from "../entities/data-source.entity";
import { DataSourceType } from "../models/data-source-type.enum";
import { SyncScopesStateDto } from "./sync-scopes-state.dto";
import { SyncScope } from "src/modules/sync/modules/sync-logs/models/sync-scope.enum";

export class DataSourceExtendedViewDto {
    constructor(dataSource: DataSourceEntity) {
        this.id = dataSource.id;
        this.type = dataSource.type;
        this.is_active = dataSource.is_active;
        this.last_sync_at = dataSource.last_sync_at;
        this.last_sync_scopes = dataSource.last_sync_scopes;
        this.created_at = dataSource.created_at;
    }

    @ApiProperty({ 
        description: 'Уникальный ID источника данных',
        type: String, example: 'e7c4a9d2-5b81-4f6e-9c3a-8d2f1b6e4a90'
    })
    id: string;

    @ApiProperty({ description: 'Тип источника данных', enum: DataSourceType, example: DataSourceType.Wb })
    type: DataSourceType;

    @ApiProperty({ description: 'Флаг доступности синхронизации источника данных', type: Boolean, example: true })
    is_active: boolean;

    @ApiProperty({ 
        description: 'Дата окончания последней полной синхронизации источника данных в формате ISO 8601', 
        type: String, example: '2026-01-03T13:50:11.237Z', nullable: true
    })
    last_sync_at: Date | null;

    @ApiProperty({
        description: 'Дата окончания последней синхронизации по областям в формате ISO 8601',
        type: SyncScopesStateDto,
        nullable: true,
        example: {
            products: '2026-01-04T00:21:50.922Z',
            prices: '2026-01-04T00:21:51.392Z',
            orders: '2026-01-04T00:22:03.509Z',
            funnel: '2026-01-04T00:22:04.143Z'
        }
    })
    last_sync_scopes: Partial<Record<SyncScope, string>> | null;

    @ApiProperty({ 
        description: 'Дата создания источника данных в формате ISO 8601',
        type: String, example: '2025-12-28T19:54:46.968Z'
    })
    created_at: Date;
}