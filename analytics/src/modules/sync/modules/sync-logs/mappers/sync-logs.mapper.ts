import { Injectable } from '@nestjs/common';
import { SyncLogViewDto } from '../dto/sync-log-view.dto';
import { SyncLogEntity } from '../entities/sync-log.entity';

@Injectable()
export class SyncLogsMapper {
    mapToView(logs: SyncLogEntity[]): SyncLogViewDto[] {
        return logs.map(log => new SyncLogViewDto(log))
    }
}
