import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersMapper } from './mappers/users.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        UserEntity
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersMapper
  ],
  exports: [UsersService],
})
export class UsersModule {}