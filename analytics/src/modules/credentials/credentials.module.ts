import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceEntity } from '../data-sources/entities/data-source.entity';
import { CredentialsService } from './credentials.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DataSourceEntity
        ])
    ],
    providers: [
        CredentialsService
    ],
    exports: [CredentialsService],
})
export class CredentialsModule { }