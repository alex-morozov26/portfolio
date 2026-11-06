import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthorizationService } from './authorization.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { TokenPairMapper } from './mappers/token-pair.mapper';
import { TokenPairViewDto } from './dto/token-pair-view.dto';

@ApiTags('Авторизация')
@Controller('authorization')
export class AuthorizationController {
    constructor(
        private readonly authService: AuthorizationService,
        private readonly tokenPairMapper: TokenPairMapper
    ) { }

    @Post('login')
    @ApiOperation({ summary: 'Вход пользователя в систему' })
    @ApiCreatedResponse({ description: 'Пара access и refresh токенов', type: TokenPairViewDto })
    @ApiBadRequestResponse({ 
        description: 'Неверный запрос',
        example: {
            message: 'Логин и пароль обязательны!',
            error: 'Bad Request',
            statusCode: 400
        }
    })
    @ApiForbiddenResponse({ 
        description: 'Ошибка доступа',
        example: {
            message: 'Неверные учетные данные!',
            error: 'Forbidden',
            statusCode: 403
        }
    })
    async login(@Body() body: LoginDto) {
        if (!body || !body.username || !body.password) {
            throw new BadRequestException('Логин и пароль обязательны!')
        };
        const user = await this.authService.validateUser(body.username, body.password);
        const tokenPair = await this.authService.login(user);
        return this.tokenPairMapper.mapToView(tokenPair);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Обновление пары access и refresh токенов' })
    @ApiCreatedResponse({ description: 'Новая пара access и refresh токенов', type: TokenPairViewDto })
    @ApiBadRequestResponse({ 
        description: 'Неверный запрос',
        example: {
            message: 'Refresh токен обязателен!',
            error: 'Bad Request',
            statusCode: 400
        }
    })
    @ApiForbiddenResponse({ 
        description: 'Ошибка доступа',
        example: {
            message: 'Неверный refresh токен!',
            error: 'Forbidden',
            statusCode: 403
        }
    })
    async refresh(@Body() body: RefreshTokenDto) {
        if (!body || !body.refresh_token) {
            throw new BadRequestException('Refresh токен обязателен!')
        }
        const tokenPair = await this.authService.refresh(body.refresh_token);
        return this.tokenPairMapper.mapToView(tokenPair);
    }

    @Post('logout')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Выход пользователя из системы' })
    @ApiCreatedResponse({
        description: 'Успешный выход',
    })
    @ApiUnauthorizedResponse({
        description: 'Ошибка авторизации',
        example: {
            message: 'Unauthorized',
            statusCode: 401
        }
    })
    @UseGuards(JwtAuthGuard)
    async logout(@CurrentUser() user: UserEntity) {
        return await this.authService.logout(user.id);
    }
}