import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthorizationService } from './authorization.service';
import { AuthorizationController } from './authorization.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { TokenPairMapper } from './mappers/token-pair.mapper';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: process.env.JWT_ACCESS_EXPIRES
                    ? Number(process.env.JWT_ACCESS_EXPIRES)
                    : 3600,
            },
        }),
    ],
    controllers: [AuthorizationController],
    providers: [
        AuthorizationService,
        JwtStrategy,
        TokenPairMapper
    ],
    exports: [AuthorizationService],
})
export class AuthorizationModule { }