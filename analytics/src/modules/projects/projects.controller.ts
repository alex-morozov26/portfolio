import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../authorization/guards/jwt.guard';
import { ProjectsService } from './projects.service';
import { CurrentUser } from '../authorization/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ProjectsMapper } from './mappers/projects.mapper';
import { ProjectViewDto } from './dto/project-view.dto';
import { ProjectsExtendedMapper } from './mappers/projects-extended.mapper';
import { ProjectExtendedViewDto } from './dto/project-extended-view.dto';
import { DataSourceViewDto } from '../data-sources/dto/data-source-view.dto';
import { DataSourcesMapper } from '../data-sources/mappers/data-sources.mapper';

@ApiTags('Проекты')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly projectsMapper: ProjectsMapper,
        private readonly projectsExtendedMapper: ProjectsExtendedMapper,
        private readonly dataSourcesMapper: DataSourcesMapper
    ) { }

    @Get()
    @ApiOperation({ summary: 'Получение проектов текущего пользователя' })
    @ApiOkResponse({ description: 'Проекты текущего пользователя', type: [ProjectViewDto] })
    @ApiUnauthorizedResponse({
        description: 'Ошибка авторизации',
        example: {
            message: 'Unauthorized',
            statusCode: 401
        }
    })
    @UseGuards(JwtAuthGuard)
    async getMyProjects(@CurrentUser() user: UserEntity) {
        const projects = await this.projectsService.findByUsename(user.username);
        return projects.map(project => this.projectsMapper.mapToView(project));
    }

    @Get(':projectId')
    @ApiOperation({ summary: 'Получение информации о конкретном проекте' })
    @ApiParam({ name: 'projectId', description: 'ID проекта', type: String, example: '8f2c6e3a-9c8e-4c4f-9b0b-1f7a6e9c2d41' })
    @ApiOkResponse({ description: 'Информация о конкретном проекте', type: ProjectExtendedViewDto })
    @ApiUnauthorizedResponse({
        description: 'Ошибка авторизации',
        example: {
            message: 'Unauthorized',
            statusCode: 401
        }
    })
    @ApiForbiddenResponse({ 
        description: 'Ошибка доступа',
        example: {
            message: 'Нет доступа к проекту!',
            error: 'Forbidden',
            statusCode: 403
        } 
    })
    @ApiNotFoundResponse({ 
        description: 'Ресурс не найден',
        example: {
            message: 'Проект не найден!',
            error: 'Not Found',
            statusCode: 404
        } 
    })
    @UseGuards(JwtAuthGuard)
    async getProject(
        @Param('projectId') projectId: string,
        @CurrentUser() user: UserEntity,
    ) {
        const project = await this.projectsService.findById(projectId, user.username);
        return this.projectsExtendedMapper.mapToView(project);
    }

    @Get(':projectId/datasources')
    @ApiOperation({ summary: 'Получение источников данных проекта' })
    @ApiParam({ name: 'projectId', description: 'ID проекта', type: String, example: '8f2c6e3a-9c8e-4c4f-9b0b-1f7a6e9c2d41' })
    @ApiOkResponse({ description: 'Источники данных', type: [DataSourceViewDto] })
    @ApiUnauthorizedResponse({
        description: 'Ошибка авторизации',
        example: {
            message: 'Unauthorized',
            statusCode: 401
        }
    })
    @ApiForbiddenResponse({ 
        description: 'Ошибка доступа',
        example: {
            message: 'Нет доступа к проекту!',
            error: 'Forbidden',
            statusCode: 403
        } 
    })
    @ApiNotFoundResponse({ 
        description: 'Ресурс не найден',
        example: {
            message: 'Проект не найден!',
            error: 'Not Found',
            statusCode: 404
        } 
    })
    @UseGuards(JwtAuthGuard)
    async getProjectDataSources(
        @Param('projectId') projectId: string,
        @CurrentUser() user: UserEntity,
    ) {
        const dataSources = await this.projectsService.findDataSources(projectId, user.username);
        return dataSources.map(dataSource => this.dataSourcesMapper.mapToView(dataSource));
    }

    @Post(':projectId/enable')
    @ApiOperation({ summary: 'Включение возможности синхронизации проекта' })
    @ApiParam({ name: 'projectId', description: 'ID проекта', type: String, example: '8f2c6e3a-9c8e-4c4f-9b0b-1f7a6e9c2d41' })
    @ApiCreatedResponse({
        description: 'Возможность синхронизации проекта включена',
    })
    @ApiUnauthorizedResponse({
        description: 'Ошибка авторизации',
        example: {
            message: 'Unauthorized',
            statusCode: 401
        }
    })
    @ApiForbiddenResponse({ 
        description: 'Ошибка доступа',
        example: {
            message: 'Нет доступа к проекту!',
            error: 'Forbidden',
            statusCode: 403
        } 
    })
    @ApiNotFoundResponse({ 
        description: 'Ресурс не найден',
        example: {
            message: 'Проект не найден!',
            error: 'Not Found',
            statusCode: 404
        } 
    })
    @UseGuards(JwtAuthGuard)
    async enable(
        @Param('projectId') projectId: string,
        @CurrentUser() user: UserEntity,
    ) {
        await this.projectsService.enable(projectId, user.username);
    }

    @Post(':projectId/disable')
    @ApiOperation({ summary: 'Отключение возможности синхронизации проекта' })
    @ApiParam({ name: 'projectId', description: 'ID проекта', type: String, example: '8f2c6e3a-9c8e-4c4f-9b0b-1f7a6e9c2d41' })
    @ApiCreatedResponse({
        description: 'Возможность синхронизации проекта отключена',
    })
    @ApiUnauthorizedResponse({
        description: 'Ошибка авторизации',
        example: {
            message: 'Unauthorized',
            statusCode: 401
        }
    })
    @ApiForbiddenResponse({ 
        description: 'Ошибка доступа',
        example: {
            message: 'Нет доступа к проекту!',
            error: 'Forbidden',
            statusCode: 403
        } 
    })
    @ApiNotFoundResponse({ 
        description: 'Ресурс не найден',
        example: {
            message: 'Проект не найден!',
            error: 'Not Found',
            statusCode: 404
        } 
    })
    @UseGuards(JwtAuthGuard)
    async disable(
        @Param('projectId') projectId: string,
        @CurrentUser() user: UserEntity,
    ) {
        await this.projectsService.disable(projectId, user.username);
    }

    @Post(':projectId/sync')
    @ApiOperation({ 
        summary: 'Запуск синхронизации проекта',
        deprecated: true
    })
    @ApiParam({ name: 'projectId', description: 'ID проекта', type: String, example: '8f2c6e3a-9c8e-4c4f-9b0b-1f7a6e9c2d41' })
    @ApiCreatedResponse({
        description: 'Синхронизация проекта завершена',
    })
    @ApiUnauthorizedResponse({
        description: 'Ошибка авторизации',
        example: {
            message: 'Unauthorized',
            statusCode: 401
        }
    })
    @ApiForbiddenResponse({ 
        description: 'Ошибка доступа',
        example: {
            message: 'Нет доступа к проекту!',
            error: 'Forbidden',
            statusCode: 403
        } 
    })
    @ApiNotFoundResponse({ 
        description: 'Ресурс не найден',
        example: {
            message: 'Проект не найден!',
            error: 'Not Found',
            statusCode: 404
        } 
    })
    @ApiInternalServerErrorResponse({
        description: 'Ошибка синхронизации проекта',
        example: {
            message: 'Синхронизация завершилась с ошибками!',
            errors: {
                "b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62": [
                    {
                        scope: 'products',
                        message: 'Ошибка при синхронизации товаров: Неизвестная ошибка'
                    }
                ],
                "e7c4a9d2-5b81-4f6e-9c3a-8d2f1b6e4a90": [
                    {
                        scope: 'prices',
                        message: 'Ошибка при синхронизации цен: Неизвестная ошибка'
                    }
                ]
            }
        }
    })
    @UseGuards(JwtAuthGuard)
    async sync(
        @Param('projectId') projectId: string,
        @CurrentUser() user: UserEntity,
    ) {
        await this.projectsService.sync(projectId, user.username);
    }
}