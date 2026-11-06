import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserViewDto } from '../dto/user-view.dto';

@Injectable()
export class UsersMapper {
    mapToView(user: UserEntity): UserViewDto {
        return new UserViewDto(user);
    }
}
