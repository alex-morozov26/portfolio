import { Injectable } from '@nestjs/common';
import { TokenPair } from '../models/token-pair.interface';
import { TokenPairViewDto } from '../dto/token-pair-view.dto';

@Injectable()
export class TokenPairMapper {
    mapToView(pair: TokenPair): TokenPairViewDto {
        return new TokenPairViewDto(pair);
    }
}
