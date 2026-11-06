import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncSnapshotEntity } from './entities/sync-snapshot.entity';
import { SyncSnapshotsService } from './sync-snapshots.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SyncSnapshotEntity
        ])
    ],
    providers: [
        SyncSnapshotsService
    ],
    exports: [
        SyncSnapshotsService
    ],
})
export class SyncSnapshotsModule { }