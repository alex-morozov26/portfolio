import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../authorization/guards/jwt.guard';
import { SyncLogsService } from './sync-logs.service';
import { GetSyncLogsDto } from './dto/get-sync-logs.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { CurrentUser } from 'src/modules/authorization/decorators/current-user.decorator';
import { ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SyncLogsMapper } from './mappers/sync-logs.mapper';
import { SyncLogViewDto } from './dto/sync-log-view.dto';

@ApiTags('Логи синхронизации')
@ApiBearerAuth()
@Controller('sync_logs')
export class SyncLogsController {
    constructor(
        private readonly syncLogsService: SyncLogsService,
        private readonly syncLogsMapper: SyncLogsMapper
    ) { }

    @Get()
    @ApiOperation({ summary: 'Получение логов по всем проектам пользователя' })
    @ApiOkResponse({ description: 'Логи синхронизации по всем проектам пользователя', type: [SyncLogViewDto] })
    @ApiUnauthorizedResponse({
        description: 'Ошибка авторизации',
        example: {
            message: 'Unauthorized',
            statusCode: 401
        }
    })
    @UseGuards(JwtAuthGuard)
    async getAll(
        @Query() query: GetSyncLogsDto,
        @CurrentUser() user: UserEntity
    ) {
        const logs = await this.syncLogsService.getLogsForUser(user.id, query);
        return this.syncLogsMapper.mapToView(logs);
    }

    @Get('project/:projectId')
    @ApiOperation({ summary: 'Получение логов по конкретному проекту' })
    @ApiParam({ name: 'projectId', description: 'ID проекта', type: String, example: '8f2c6e3a-9c8e-4c4f-9b0b-1f7a6e9c2d41' })
    @ApiOkResponse({ description: 'Логи синхронизации по конкретному проекту', type: [SyncLogViewDto] })
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
    async getByProject(
        @Param('projectId') projectId: string,
        @Query() query: GetSyncLogsDto,
        @CurrentUser() user: UserEntity
    ) {
        const logs = await this.syncLogsService.getLogsForProject(user.username, projectId, query);
        return this.syncLogsMapper.mapToView(logs);
    }

    @Get('datasource/:dataSourceId')
    @ApiOperation({ summary: 'Получение логов по конкретному источнику данных' })
    @ApiParam({ name: 'dataSourceId', description: 'ID источника данных', type: String, example: 'e7c4a9d2-5b81-4f6e-9c3a-8d2f1b6e4a90' })
    @ApiOkResponse({ description: 'Логи синхронизации по конкретному источнику данных', type: [SyncLogViewDto] })
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
            message: 'Нет доступа к источнику данных!',
            error: 'Forbidden',
            statusCode: 403
        } 
    })
    @ApiNotFoundResponse({ 
        description: 'Ресурс не найден',
        example: {
            message: 'Источник данных не найден!',
            error: 'Not Found',
            statusCode: 404
        } 
    })
    @UseGuards(JwtAuthGuard)
    async getByDataSource(
        @Param('dataSourceId') dataSourceId: string,
        @Query() query: GetSyncLogsDto,
        @CurrentUser() user: UserEntity
    ) {
        const logs = await this.syncLogsService.getLogsForDataSource(user.username, dataSourceId, query);
        return this.syncLogsMapper.mapToView(logs);
    }
}