import { Injectable } from '@nestjs/common';
import { SyncAdapterInterface } from './models/sync-adapter.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSourceEntity } from '../data-sources/entities/data-source.entity';
import { Repository } from 'typeorm';
import { DataSourceType } from '../data-sources/models/data-source-type.enum';
import { WbSyncAdapter } from './modules/wb/wb-sync.adapter';
import { OzonSyncAdapter } from './modules/ozon/ozon-sync.adapter';
import { ReadAdapterInterface } from './models/read-adapter.interface';
import { WbReadAdapter } from './modules/wb/wb-read.adapter';
import { OzonReadAdapter } from './modules/ozon/ozon-read.adapter';

@Injectable()
export class AdaptersService {
    constructor(
        @InjectRepository(DataSourceEntity)
        private readonly dataSourcesRepository: Repository<DataSourceEntity>,
        private readonly wbSyncAdapter: WbSyncAdapter,
        private readonly wbReadAdapter: WbReadAdapter,
        private readonly ozonSyncAdapter: OzonSyncAdapter,
        private readonly ozonReadAdapter: OzonReadAdapter
    ) {
        this.syncAdapters = {
            [DataSourceType.Wb]: this.wbSyncAdapter,
            [DataSourceType.Ozon]: this.ozonSyncAdapter
        }
        this.readAdapters = {
            [DataSourceType.Wb]: this.wbReadAdapter,
            [DataSourceType.Ozon]: this.ozonReadAdapter
        }
    }

    private syncAdapters: Record<DataSourceType, SyncAdapterInterface>;
    private readAdapters: Record<DataSourceType, ReadAdapterInterface>;

    private async getDataSourceType(dataSourceId: string): Promise<DataSourceType> {
        const dataSource = await this.dataSourcesRepository.findOne({
            where: {
                id: dataSourceId
            }
        })

        return dataSource!.type;
    }

    async getSyncAdapter(dataSourceId: string): Promise<SyncAdapterInterface> {
        const type = await this.getDataSourceType(dataSourceId)
        return this.syncAdapters[type];
    }

    async getReadAdapter(dataSourceId: string): Promise<ReadAdapterInterface> {
        const type = await this.getDataSourceType(dataSourceId)
        return this.readAdapters[type];
    }
}