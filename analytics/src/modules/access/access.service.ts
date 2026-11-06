import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSourceEntity } from '../data-sources/entities/data-source.entity';
import { ProjectEntity } from '../projects/entities/project.entity';

@Injectable()
export class AccessService {
    constructor(
        @InjectRepository(ProjectEntity)
        private readonly projectsRepository: Repository<ProjectEntity>,
        @InjectRepository(DataSourceEntity)
        private readonly dataSourcesRepository: Repository<DataSourceEntity>,
    ) { }

    private async getProjectWithUsername(projectId: string, username: string): Promise<ProjectEntity | null> {
        return this.projectsRepository
            .createQueryBuilder('project')
            .innerJoin('project.users', 'user')
            .where('project.id = :projectId', { projectId })
            .andWhere('user.username = :username', { username })
            .select('project.id')
            .getOne();
    }

    async checkAccessByProject(projectId: string, username: string): Promise<void> {
        const project = await this.getProjectWithUsername(projectId, username);

        if (!project) {
            const exists = await this.projectsRepository.findOne({ where: { id: projectId }, select: { id: true } });
            if (!exists) throw new NotFoundException('Проект не найден!');
            throw new ForbiddenException('Нет доступа к проекту!');
        }
    }

    async checkAccessByDataSource(dataSourceId: string, username: string): Promise<void> {
        const dataSource = await this.dataSourcesRepository.findOne({
            select: {
                project: {
                    id: true
                }
            },
            where: {
                id: dataSourceId
            },
            relations: {
                project: true
            }
        })

        if (!dataSource) {
            throw new NotFoundException(`Источник данных не найден!`);
        }
        
        const project = await this.getProjectWithUsername(dataSource.project.id, username);

        if (!project) {
            throw new ForbiddenException('Нет доступа к источнику данных!');
        }
    }
}