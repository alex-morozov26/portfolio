import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceEntity } from '../data-sources/entities/data-source.entity';
import { WbAdapterModule } from './modules/wb/wb-adapter.module';
import { OzonAdapterModule } from './modules/ozon/ozon-adapter.module';
import { AdaptersService } from './adapters.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DataSourceEntity
        ]),
        WbAdapterModule,
        OzonAdapterModule
    ],
    providers: [
        AdaptersService
    ],
    exports: [AdaptersService],
})
export class AdaptersModule { }