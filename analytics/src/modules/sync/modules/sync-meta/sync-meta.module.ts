import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceEntity } from 'src/modules/data-sources/entities/data-source.entity';
import { SyncMetaService } from './sync-meta.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DataSourceEntity
        ])
    ],
    providers: [
        SyncMetaService
    ],
    exports: [
        SyncMetaService
    ],
})
export class SyncMetaModule { }