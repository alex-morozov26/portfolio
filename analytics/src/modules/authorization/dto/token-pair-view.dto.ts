import { ApiProperty } from "@nestjs/swagger";
import { TokenPair } from "../models/token-pair.interface";

export class TokenPairViewDto {
    constructor(pair: TokenPair) {
        this.access_token = pair.access_token;
        this.refresh_token = pair.refresh_token;
    }

    @ApiProperty({ 
        description: 'Access токен', type: String,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ...' 
    })
    access_token: string;

    @ApiProperty({
        description: 'Refresh токен', type: String,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ...' 
    })
    refresh_token: string;
}