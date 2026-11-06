import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceEntity } from './entities/data-source.entity';
import { DataSourcesService } from './data-sources.service';
import { DataSourcesController } from './data-sources.controller';
import { AccessModule } from '../access/access.module';
import { AdaptersModule } from '../adapters/adapters.module';
import { DataSourcesMapper } from './mappers/data-sources.mapper';
import { DataSourcesExtendMapper } from './mappers/data-sources-extended.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        DataSourceEntity
    ]),
    AccessModule,
    AdaptersModule
  ],
  controllers: [DataSourcesController],
  providers: [
    DataSourcesService,
    DataSourcesMapper,
    DataSourcesExtendMapper
  ],
  exports: [
    DataSourcesService,
    DataSourcesMapper
  ],
})
export class DataSourcesModule {}