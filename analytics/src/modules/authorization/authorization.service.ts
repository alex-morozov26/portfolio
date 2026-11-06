import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/entities/user.entity';
import { TokenPair } from './models/token-pair.interface';

@Injectable()
export class AuthorizationService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string): Promise<UserEntity> {
        const user = await this.usersService.findByUsername(username);
        const isMatch = user ? await bcrypt.compare(password, user.password_hash) : false;

        if (!isMatch) {
            throw new ForbiddenException('Неверные учетные данные!');
        }

        return user!;
    }

    async login(user: UserEntity): Promise<TokenPair> {
        const payload = { username: user.username, sub: user.id };
        const accessTokenExpires: number = process.env.JWT_ACCESS_EXPIRES ? Number(process.env.JWT_ACCESS_EXPIRES) : 3600;
        const refreshTokenExpires: number = process.env.JWT_REFRESH_EXPIRES ? Number(process.env.JWT_REFRESH_EXPIRES) : 604800;

        const access_token = this.jwtService.sign(payload, { expiresIn: accessTokenExpires });
        const refresh_token = this.jwtService.sign(payload, { expiresIn: refreshTokenExpires });

        await this.usersService.setRefreshToken(user.id, refresh_token);

        return { access_token, refresh_token };
    }

    async refresh(refreshToken: string): Promise<TokenPair> {
        try {
            const payload = this.jwtService.verify(refreshToken);

            const user = await this.usersService.findById(payload.sub);
            if (!user || user.refresh_token !== refreshToken) {
                throw new ForbiddenException('Неверный refresh токен!');
            }

            return this.login(user);
        } catch {
            throw new ForbiddenException('Неверный refresh токен!');
        }
    }

    async logout(userId: string): Promise<void> {
        await this.usersService.clearRefreshToken(userId);
    }
}
