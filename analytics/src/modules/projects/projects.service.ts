import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './entities/project.entity';
import { DataSourceEntity } from '../data-sources/entities/data-source.entity';
import { DataSourcesService } from '../data-sources/data-sources.service';
import { AccessService } from '../access/access.service';
import { AdaptersService } from '../adapters/adapters.service';
import { SyncMode } from '../adapters/models/sync-mode.enum';
import { SyncError } from '../sync/modules/sync-logs/models/sync-error.interface';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(ProjectEntity)
        private readonly projectsRepository: Repository<ProjectEntity>,
        private readonly dataSourcesService: DataSourcesService,
        private readonly accessService: AccessService,
        private readonly adaptersService: AdaptersService
    ) { }

    async findByUsename(username: string): Promise<ProjectEntity[]> {
        return this.projectsRepository
            .createQueryBuilder('project')
            .innerJoin('project.users', 'user')
            .where('user.username = :username', { username })
            .getMany();
    }

    async findById(projectId: string, username: string): Promise<ProjectEntity> {
        await this.accessService.checkAccessByProject(projectId, username);

        const project = await this.projectsRepository
            .createQueryBuilder('project')
            .leftJoin('project.data_sources', 'data_source')
            .addSelect([
                'project.id',
                'project.name',
                'project.is_active',
                'project.created_at',
                'data_source.id',
                'data_source.type',
                'data_source.is_active',
                'data_source.last_sync_at',
                'data_source.created_at',
            ])
            .where('project.id = :projectId', { projectId })
            .getOne();

        return project!;
    }

    async findDataSources(projectId: string, username: string): Promise<DataSourceEntity[]> {
        await this.accessService.checkAccessByProject(projectId, username);
        return this.dataSourcesService.findManyByProject(projectId);
    }

    async enable(projectId: string, username: string): Promise<void> {
        await this.accessService.checkAccessByProject(projectId, username);

        await this.projectsRepository.update(projectId, {
            is_active: true
        });
    }

    async disable(projectId: string, username: string): Promise<void> {
        await this.accessService.checkAccessByProject(projectId, username);

        await this.projectsRepository.update(projectId, {
            is_active: false
        });
    }

    async sync(projectId: string, username: string): Promise<void> {
        throw new ServiceUnavailableException('Эндпоинт временно отключен!');
        // await this.accessService.checkAccessByProject(projectId, username);
        // const project = await this.projectsRepository.findOne({
        //     where: { id: projectId },
        //     relations: {
        //         data_sources: true
        //     }
        // })

        // if (!project) {
        //     throw new NotFoundException('Проект не найден!')
        // }

        // if (!project.is_active) {
        //     throw new ForbiddenException('Проект не активен!');
        // }

        // const activeSources = project.data_sources.filter(ds => ds.is_active);

        // const results = await Promise.all(activeSources.map(dataSource => {
        //     return this.dataSourceSync(dataSource);
        // }))

        // const errors: Record<string, SyncError[]> = {}
        // results.forEach(result => {
        //     if (result?.errors) {
        //         errors[result.dataSourceId] = result.errors
        //     }
        // })

        // if (Object.keys(errors).length > 0) {
        //     throw new InternalServerErrorException({ message: 'Синхронизация завершилась с ошибками!', errors });
        // }
    }

    // private async dataSourceSync(dataSource: DataSourceEntity) {
    //     const adapter = await this.adaptersService.getSyncAdapter(dataSource.id);
    //     try {
    //         await adapter.sync(dataSource.id, SyncMode.Force);
    //     } catch (error) { 
    //         const response = error.getResponse();
        
    //         return {
    //             dataSourceId: dataSource.id,
    //             errors: response.errors,
    //         };
    //     }
    // }
}