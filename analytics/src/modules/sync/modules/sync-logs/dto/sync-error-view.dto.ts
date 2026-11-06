import { ApiProperty } from '@nestjs/swagger';
import { SyncScope } from '../models/sync-scope.enum';
import { SyncError } from '../models/sync-error.interface';

export class SyncErrorViewDto {
    constructor(entity: SyncError) {
        this.scope = entity.scope;
        this.message = entity.message;
    }

    @ApiProperty({ description: 'Область синхронизации', enum: SyncScope })
    scope: SyncScope;

    @ApiProperty({ description: 'Режим синхронизации', type: String })
    message: string;
}
