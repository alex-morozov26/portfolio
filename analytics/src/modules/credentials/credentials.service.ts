import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSourceEntity } from '../data-sources/entities/data-source.entity';
import { Repository } from 'typeorm';
import { Credentials } from './models/credentials.type';

@Injectable()
export class CredentialsService {
    constructor(
        @InjectRepository(DataSourceEntity)
        private readonly dataSourcesRepository: Repository<DataSourceEntity>
    ) {}

    private async getDataSource(dataSourceId: string): Promise<DataSourceEntity> {
        const dataSource = await this.dataSourcesRepository.findOne({
            where: {
                id: dataSourceId
            }
        })

        return dataSource!;
    }
    
    async getCredentials(dataSourceId: string): Promise<Credentials> {
        const dataSource = await this.getDataSource(dataSourceId)
        return {
            wb_api_token: dataSource.getWbApiToken(),
            ozon_client_id: dataSource.getOzonClientId(),
            ozon_api_key: dataSource.getOzonApiKey(),
            ozon_performance_client_id: dataSource.getOzonPerformanceClientId(),
            ozon_performance_client_secret: dataSource.getOzonPerformanceClientSecret()
        }
    }
}