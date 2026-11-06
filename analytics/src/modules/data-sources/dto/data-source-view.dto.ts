import { ApiProperty } from "@nestjs/swagger";
import { DataSourceEntity } from "../entities/data-source.entity";
import { DataSourceType } from "../models/data-source-type.enum";

export class DataSourceViewDto {
    constructor(dataSource: DataSourceEntity) {
        this.id = dataSource.id;
        this.type = dataSource.type;
        this.is_active = dataSource.is_active;
        this.last_sync_at = dataSource.last_sync_at;
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
        description: 'Дата создания источника данных в формате ISO 8601',
        type: String, example: '2025-12-28T19:54:46.968Z'
    })
    created_at: Date;
}