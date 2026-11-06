import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "../entities/user.entity";

export class UserViewDto {
    constructor(user: UserEntity) {
        this.id = user.id;
        this.username = user.username;
        this.created_at = user.created_at;
    }

    @ApiProperty({ description: 'Уникальный ID пользователя', type: String, example: 'a648e18e-af7b-406f-9790-d480c89b9ae8' })
    id: string;

    @ApiProperty({ description: 'Уникальное имя пользователя', type: String, example: 'admin' })
    username: string;

    @ApiProperty({ description: 'Дата регистрации пользователя в формате ISO 8601', type: String, example: '2025-12-28T16:54:46.968Z' })
    created_at: Date;
}