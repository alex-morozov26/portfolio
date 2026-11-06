import { Module } from '@nestjs/common';
import { SyncScheduler } from './sync.scheduler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from '../projects/entities/project.entity';
import { AdaptersModule } from '../adapters/adapters.module';
import { SyncService } from './sync.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProjectEntity
        ]),
        AdaptersModule
    ],
    providers: [
        SyncScheduler,
        SyncService
    ]
})
export class SyncModule { }