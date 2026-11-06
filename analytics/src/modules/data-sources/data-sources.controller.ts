import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DataSourcesService } from './data-sources.service';
import { CurrentUser } from '../authorization/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../authorization/guards/jwt.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiNotImplementedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { DataSourceExtendedViewDto } from './dto/data-source-extended-view.dto';
import { DataSourcesExtendMapper } from './mappers/data-sources-extended.mapper';

@ApiTags('Источники данных')
@ApiBearerAuth()
@Controller('datasources')
export class DataSourcesController {
    constructor(
        private readonly dataSourcesService: DataSourcesService,
        private readonly dataSourcesExtendedMapper: DataSourcesExtendMapper
    ) { }

    @Get(':dataSourceId')
    @ApiOperation({ summary: 'Получение информации о конкретном источнике данных' })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiOkResponse({ description: 'Информация о конкретном источнике данных', type: DataSourceExtendedViewDto })
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
    async get(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        const dataSource = await this.dataSourcesService.get(dataSourceId, user.username);
        return this.dataSourcesExtendedMapper.mapToView(dataSource);
    }

    @Post(':dataSourceId/enable')
    @ApiOperation({ summary: 'Включение возможности синхронизации источника данных' })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiCreatedResponse({
        description: 'Возможность синхронизации источника данных включена',
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
    async enable(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        await this.dataSourcesService.enable(dataSourceId, user.username);
    }

    @Post(':dataSourceId/disable')
    @ApiOperation({ summary: 'Отключение возможности синхронизации источника данных' })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiCreatedResponse({
        description: 'Возможность синхронизации источника данных отключена',
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
    async disable(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        await this.dataSourcesService.disable(dataSourceId, user.username);
    }

    @Post(':dataSourceId/sync')
    @ApiOperation({ 
        summary: 'Запуск синхронизации источника данных',
        deprecated: true
    })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiCreatedResponse({
        description: 'Синхронизация источника данных завершена',
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
            message: 'Источник данных не активен!',
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
    @ApiInternalServerErrorResponse({
        description: 'Ошибка синхронизации источника данных',
        example: {
            message: 'Синхронизация завершилась с ошибками!',
            errors: [
                {
                    scope: 'products',
                    message: 'Ошибка при синхронизации товаров: Неизвестная ошибка'
                },
                {
                    scope: 'prices',
                    message: 'Ошибка при синхронизации цен: Неизвестная ошибка'
                }
            ]
        }
    })
    @UseGuards(JwtAuthGuard)
    async sync(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        await this.dataSourcesService.sync(dataSourceId, user.username);
    }

    @Get(':dataSourceId/products')
    @ApiOperation({ summary: 'Получение товаров по источнику данных' })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiOkResponse({
        description: 'Товары в виде сырых данных. Формат будет определен позже'
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
    async getProducts(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        return await this.dataSourcesService.getProducts(dataSourceId, user.username);
    }

    @Post(':dataSourceId/products/sync')
    @ApiOperation({
        summary: 'Запуск синхронизации товаров в источнике данных',
        deprecated: true
    })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiCreatedResponse({
        description: 'Синхронизация товаров завершена',
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
            message: 'Источник данных не активен!',
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
    @ApiInternalServerErrorResponse({
        description: 'Ошибка синхронизации товаров',
        example: {
            message: 'Синхронизация завершилась с ошибками!',
            errors: [
                {
                    scope: 'products',
                    message: 'Ошибка при синхронизации товаров: Неизвестная ошибка'
                }
            ]
        }
    })
    @UseGuards(JwtAuthGuard)
    async syncProducts(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        await this.dataSourcesService.syncProducts(dataSourceId, user.username);
    }

    @Get(':dataSourceId/prices')
    @ApiOperation({ summary: 'Получение цен по источнику данных' })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiOkResponse({
        description: 'Цены в виде сырых данных. Формат будет определен позже'
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
    async getPrices(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        return await this.dataSourcesService.getPrices(dataSourceId, user.username);
    }

    @Post(':dataSourceId/prices/sync')
    @ApiOperation({
        summary: 'Запуск синхронизации цен в источнике данных',
        deprecated: true
    })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiCreatedResponse({
        description: 'Синхронизация цен завершена',
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
            message: 'Источник данных не активен!',
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
    @ApiInternalServerErrorResponse({
        description: 'Ошибка синхронизации цен',
        example: {
            message: 'Синхронизация завершилась с ошибками!',
            errors: [
                {
                    scope: 'prices',
                    message: 'Ошибка при синхронизации цен: Неизвестная ошибка'
                }
            ]
        }
    })
    @UseGuards(JwtAuthGuard)
    async syncPrices(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        await this.dataSourcesService.syncPrices(dataSourceId, user.username);
    }

    @Get(':dataSourceId/orders')
    @ApiOperation({ summary: 'Получение заказов по источнику данных' })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiOkResponse({
        description: 'Заказы в виде сырых данных. Формат будет определен позже'
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
    async getOrders(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        return await this.dataSourcesService.getOrders(dataSourceId, user.username);
    }

    @Post(':dataSourceId/orders/sync')
    @ApiOperation({
        summary: 'Запуск синхронизации заказов в источнике данных',
        deprecated: true
    })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiCreatedResponse({
        description: 'Синхронизация заказов завершена',
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
    @ApiInternalServerErrorResponse({
        description: 'Ошибка синхронизации заказов',
        example: {
            message: 'Синхронизация завершилась с ошибками!',
            errors: [
                {
                    scope: 'orders',
                    message: 'Ошибка при синхронизации заказов: Неизвестная ошибка'
                }
            ]
        }
    })
    @UseGuards(JwtAuthGuard)
    async syncOrders(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        await this.dataSourcesService.syncOrders(dataSourceId, user.username);
    }

    @Get(':dataSourceId/funnel')
    @ApiOperation({ summary: 'Получение воронок по источнику данных' })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiOkResponse({
        description: 'Воронки в виде сырых данных. Формат будет определен позже'
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
    async getFunnel(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        return await this.dataSourcesService.getFunnel(dataSourceId, user.username);
    }

    @Post(':dataSourceId/funnel/sync')
    @ApiOperation({
        summary: 'Запуск синхронизации воронок в источнике данных',
        deprecated: true
    })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiCreatedResponse({
        description: 'Синхронизация воронок завершена',
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
    @ApiInternalServerErrorResponse({
        description: 'Ошибка синхронизации воронок',
        example: {
            message: 'Синхронизация завершилась с ошибками!',
            errors: [
                {
                    scope: 'funnel',
                    message: 'Ошибка при синхронизации воронок: Неизвестная ошибка'
                }
            ]
        }
    })
    @UseGuards(JwtAuthGuard)
    async syncFunnel(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        await this.dataSourcesService.syncFunnel(dataSourceId, user.username);
    }

    @Get(':dataSourceId/stocks')
    @ApiOperation({ summary: 'Получение остатков по источнику данных' })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiOkResponse({
        description: 'Остатки в виде сырых данных. Формат будет определен позже'
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
    async getStocks(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        return await this.dataSourcesService.getStocks(dataSourceId, user.username);
    }

    @Post(':dataSourceId/stocks/sync')
    @ApiOperation({ 
        summary: 'Запуск синхронизации остатков в источнике данных',
        deprecated: true
    })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiCreatedResponse({
        description: 'Синхронизация остатков завершена',
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
    @ApiInternalServerErrorResponse({
        description: 'Ошибка синхронизации остатков',
        example: {
            message: 'Синхронизация завершилась с ошибками!',
            errors: [
                {
                    scope: 'stocks',
                    message: 'Ошибка при синхронизации остатков: Неизвестная ошибка'
                }
            ]
        }
    })
    @UseGuards(JwtAuthGuard)
    async syncStocks(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        await this.dataSourcesService.syncStocks(dataSourceId, user.username);
    }

    @Get(':dataSourceId/warehouses')
    @ApiOperation({ summary: 'Получение складов по источнику данных' })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiOkResponse({
        description: 'Склады в виде сырых данных. Формат будет определен позже'
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
    @ApiNotImplementedResponse({
        description: 'Операция не поддерживается',
        example: {
            message: 'Получение складов не реализовано для WB!',
            error: 'Not Implemented',
            statusCode: 501
        }
    })
    @UseGuards(JwtAuthGuard)
    async getWarehouses(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        return await this.dataSourcesService.getWarehouses(dataSourceId, user.username);
    }

    @Post(':dataSourceId/warehouses/sync')
    @ApiOperation({
        summary: 'Запуск синхронизации складов в источнике данных',
        deprecated: true
    })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiCreatedResponse({
        description: 'Синхронизация складов завершена',
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
    @ApiInternalServerErrorResponse({
        description: 'Ошибка синхронизации складов',
        example: {
            message: 'Синхронизация завершилась с ошибками!',
            errors: [
                {
                    scope: 'warehouses',
                    message: 'Синхронизация складов не реализована для WB!'
                }
            ]
        }
    })
    @UseGuards(JwtAuthGuard)
    async syncWarehouses(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        await this.dataSourcesService.syncWarehouses(dataSourceId, user.username);
    }

    @Get(':dataSourceId/ads_campaigns')
    @ApiOperation({ summary: 'Получение списка рекламных кампаний по источнику данных' })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiOkResponse({
        description: 'Список рекламных кампаний в виде сырых данных. Формат будет определен позже'
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
    async getAdsCampaigns(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        return await this.dataSourcesService.getAdsCampaigns(dataSourceId, user.username);
    }

    @Post(':dataSourceId/ads_campaigns/sync')
    @ApiOperation({
        summary: 'Запуск синхронизации списка рекламных кампаний в источнике данных',
        deprecated: true
    })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiCreatedResponse({
        description: 'Синхронизация списка рекламных кампаний завершена',
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
            message: 'Источник данных не активен!',
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
    @ApiInternalServerErrorResponse({
        description: 'Ошибка синхронизации списка рекламных кампаний',
        example: {
            message: 'Синхронизация завершилась с ошибками!',
            errors: [
                {
                    scope: 'ads_campaigns',
                    message: 'Ошибка при синхронизации списка рекламных кампаний: Неизвестная ошибка'
                }
            ]
        }
    })
    @UseGuards(JwtAuthGuard)
    async syncAdsCampaigns(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        await this.dataSourcesService.syncAdsCampaigns(dataSourceId, user.username);
    }

    @Get(':dataSourceId/ads_stats')
    @ApiOperation({ summary: 'Получение статистики по рекламе по источнику данных' })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiOkResponse({
        description: 'Статистика по рекламе в виде сырых данных. Формат будет определен позже'
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
    async getAdsStats(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        return await this.dataSourcesService.getAdsStats(dataSourceId, user.username);
    }

    @Post(':dataSourceId/ads_stats/sync')
    @ApiOperation({
        summary: 'Запуск синхронизации статистики по рекламе в источнике данных',
        deprecated: true
    })
    @ApiParam({ 
        name: 'dataSourceId', description: 'ID источника данных', type: String,
        example: 'b3d1f9e4-6a2a-4c91-a8b5-2f4d7e8c1a62'
    })
    @ApiCreatedResponse({
        description: 'Синхронизация статистики по рекламе завершена',
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
            message: 'Источник данных не активен!',
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
    @ApiInternalServerErrorResponse({
        description: 'Ошибка синхронизации статистики по рекламе',
        example: {
            message: 'Синхронизация завершилась с ошибками!',
            errors: [
                {
                    scope: 'ads_stats',
                    message: 'Ошибка при синхронизации статистики по рекламе: Неизвестная ошибка'
                }
            ]
        }
    })
    @UseGuards(JwtAuthGuard)
    async syncAdsStats(
        @Param('dataSourceId') dataSourceId: string,
        @CurrentUser() user: UserEntity,
    ) {
        await this.dataSourcesService.syncAdsStats(dataSourceId, user.username);
    }
}