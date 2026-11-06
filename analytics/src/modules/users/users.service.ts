import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async findByUsername(username: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { username } });
    }

    async findById(id: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async setRefreshToken(id: string, refreshToken: string) {
        await this.userRepository.update(id, { refresh_token: refreshToken });
    }

    async clearRefreshToken(id: string) {
        await this.userRepository.update(id, { refresh_token: null });
    }

    async findAll(): Promise<Array<UserEntity>> {
        return this.userRepository.find({
            select: {
                id: true,
                username: true,
                created_at: true
            }
        })
    }
}