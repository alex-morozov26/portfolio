import { Injectable } from '@nestjs/common';
import { ProjectEntity } from '../entities/project.entity';
import { ProjectExtendedViewDto } from '../dto/project-extended-view.dto';

@Injectable()
export class ProjectsExtendedMapper {
    mapToView(project: ProjectEntity): ProjectExtendedViewDto {
        return new ProjectExtendedViewDto(project);
    }
}
