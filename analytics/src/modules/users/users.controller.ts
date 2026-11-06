import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../authorization/guards/jwt.guard';
import { CurrentUser } from '../authorization/decorators/current-user.decorator';
import { UserEntity } from './entities/user.entity';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UsersMapper } from './mappers/users.mapper';
import { UserViewDto } from './dto/user-view.dto';

@ApiTags('Пользователи')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly usersMapper: UsersMapper
    ) { }

    @Get()
    @ApiOperation({ summary: 'Получение всех пользователей системы' })
    @ApiOkResponse({ description: 'Пользователи системы', type: [UserViewDto] })
    @ApiUnauthorizedResponse({
        description: 'Ошибка авторизации',
        example: {
            message: 'Unauthorized',
            statusCode: 401
        }
    })
    @UseGuards(JwtAuthGuard)
    async getAllUsers() {
        const users = await this.usersService.findAll();
        return users.map(user => this.usersMapper.mapToView(user));
    }

    @Get('me')
    @ApiOperation({ summary: 'Получение текущего пользователя' })
    @ApiOkResponse({ description: 'Текущий пользователь', type: UserViewDto })
    @ApiUnauthorizedResponse({
        description: 'Ошибка авторизации',
        example: {
            message: 'Unauthorized',
            statusCode: 401
        }
    })
    @UseGuards(JwtAuthGuard)
    async getMe(
        @CurrentUser() user: UserEntity
    ) {
        return this.usersMapper.mapToView(user);
    }
}