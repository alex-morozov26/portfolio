import { ApiProperty } from "@nestjs/swagger";
import { ProjectEntity } from "../entities/project.entity";

export class ProjectViewDto {
    constructor(project: ProjectEntity) {
        this.id = project.id;
        this.name = project.name;
        this.is_active = project.is_active;
        this.created_at = project.created_at;
    }

    @ApiProperty({ description: 'Уникальный ID проекта', type: String, example: '8f2c6e3a-9c8e-4c4f-9b0b-1f7a6e9c2d41' })
    id: string;

    @ApiProperty({ description: 'Имя проекта', type: String, example: 'OWMY' })
    name: string;

    @ApiProperty({ description: 'Флаг доступности синхронизации проекта', type: Boolean, example: true })
    is_active: boolean;

    @ApiProperty({ description: 'Дата создания проекта в формате ISO 8601', type: String, example: '2025-12-28T19:54:46.968Z' })
    created_at: Date;
}