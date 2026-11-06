import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ description: 'Имя пользователя', type: String, example: 'admin' })
    username: string;

    @ApiProperty({ description: 'Пароль', type: String, example: 'P@ssw0rd' })
    password: string;
}