import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { DataSourcesModule } from '../data-sources/data-sources.module';
import { AccessModule } from '../access/access.module';
import { ProjectsMapper } from './mappers/projects.mapper';
import { ProjectsExtendedMapper } from './mappers/projects-extended.mapper';
import { AdaptersModule } from '../adapters/adapters.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity
    ]),
    DataSourcesModule,
    AccessModule,
    AdaptersModule
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectsMapper,
    ProjectsExtendedMapper
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}