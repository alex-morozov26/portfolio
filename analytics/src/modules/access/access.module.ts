import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from '../projects/entities/project.entity';
import { DataSourceEntity } from '../data-sources/entities/data-source.entity';
import { AccessService } from './access.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProjectEntity,
            DataSourceEntity
        ])
    ],
    providers: [AccessService],
    exports: [AccessService],
})
export class AccessModule { }