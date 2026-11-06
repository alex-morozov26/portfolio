import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncLogEntity } from './entities/sync-log.entity';
import { SyncLogsService } from './sync-logs.service';
import { SyncLogsController } from './sync-logs.controller';
import { AccessModule } from 'src/modules/access/access.module';
import { ProjectEntity } from 'src/modules/projects/entities/project.entity';
import { DataSourceEntity } from 'src/modules/data-sources/entities/data-source.entity';
import { SyncLogsMapper } from './mappers/sync-logs.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SyncLogEntity,
      ProjectEntity,
      DataSourceEntity
    ]),
    AccessModule
  ],
  controllers: [SyncLogsController],
  providers: [
    SyncLogsService,
    SyncLogsMapper
  ],
  exports: [SyncLogsService],
})
export class SyncLogsModule {}