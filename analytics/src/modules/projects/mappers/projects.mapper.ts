import { Injectable } from '@nestjs/common';
import { ProjectEntity } from '../entities/project.entity';
import { ProjectViewDto } from '../dto/project-view.dto';

@Injectable()
export class ProjectsMapper {
    mapToView(project: ProjectEntity): ProjectViewDto {
        return new ProjectViewDto(project);
    }
}
