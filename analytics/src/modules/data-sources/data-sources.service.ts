import { ForbiddenException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSourceEntity } from './entities/data-source.entity';
import { AccessService } from '../access/access.service';
import { AdaptersService } from '../adapters/adapters.service';
import { SyncMode } from '../adapters/models/sync-mode.enum';

@Injectable()
export class DataSourcesService {
    constructor(
        @InjectRepository(DataSourceEntity)
        private readonly dataSourcesRepository: Repository<DataSourceEntity>,
        private readonly accessService: AccessService,
        private readonly adaptersService: AdaptersService
    ) { }

    async findManyByProject(projectId: string): Promise<DataSourceEntity[]>  {
        return this.dataSourcesRepository
            .createQueryBuilder('ds')
            .where('ds.projectId = :projectId', { projectId })
            .select([
                'ds.id',
                'ds.type',
                'ds.is_active',
                'ds.last_sync_at',
                'ds.created_at',
            ])
            .getMany();
    }

    // private async assertActiveForSync(dataSourceId: string): Promise<void> {
    //     const dataSource = await this.dataSourcesRepository.findOne({
    //         where: { id: dataSourceId },
    //         relations: { project: true },
    //         select: {
    //             id: true,
    //             is_active: true,
    //             project: {
    //                 id: true,
    //                 is_active: true
    //             }
    //         },
    //     });

    //     if (!dataSource) {
    //         throw new ForbiddenException('Источник данных не найден или недоступен!');
    //     }

    //     if (!dataSource.is_active) {
    //         throw new ForbiddenException('Источник данных не активен!');
    //     }

    //     if (!dataSource.project.is_active) {
    //         throw new ForbiddenException('Проект не активен!');
    //     }
    // }

    async get(dataSourceId: string, username: string): Promise<DataSourceEntity> {
        await this.accessService.checkAccessByDataSource(dataSourceId, username);
        const dataSource = await this.dataSourcesRepository.findOne({
            where: { id: dataSourceId },
            select: {
                id: true,
                type: true,
                is_active: true,
                last_sync_at: true,
                last_sync_scopes: true,
                created_at: true
            }
        })

        return dataSource!;
    }

    async enable(dataSourceId: string, username: string): Promise<void> {
        await this.accessService.checkAccessByDataSource(dataSourceId, username);

        await this.dataSourcesRepository.update(dataSourceId, {
            is_active: true
        });
    }

    async disable(dataSourceId: string, username: string): Promise<void> {
        await this.accessService.checkAccessByDataSource(dataSourceId, username);

        await this.dataSourcesRepository.update(dataSourceId, {
            is_active: false
        });
    }

    async sync(dataSourceId: string, username: string) {
        throw new ServiceUnavailableException('Эндпоинт временно отключен!');
        // await this.accessService.checkAccessByDataSource(dataSourceId, username);
        // await this.assertActiveForSync(dataSourceId);
        // const adapter = await this.adaptersService.getSyncAdapter(dataSourceId);
        // await adapter.sync(dataSourceId, SyncMode.Force);
    }

    async getProducts(dataSourceId: string, username: string) {
        await this.accessService.checkAccessByDataSource(dataSourceId, username);
        const adapter = await this.adaptersService.getReadAdapter(dataSourceId);
        return await adapter.readProducts(dataSourceId);
    }

    async syncProducts(dataSourceId: string, username: string): Promise<void> {
        throw new ServiceUnavailableException('Эндпоинт временно отключен!');
        // await this.accessService.checkAccessByDataSource(dataSourceId, username);
        // await this.assertActiveForSync(dataSourceId);
        // const adapter = await this.adaptersService.getSyncAdapter(dataSourceId);
        // await adapter.syncProducts(dataSourceId, SyncMode.Force);
    }

    async getPrices(dataSourceId: string, username: string) {
        await this.accessService.checkAccessByDataSource(dataSourceId, username);
        const adapter = await this.adaptersService.getReadAdapter(dataSourceId);
        return await adapter.readPrices(dataSourceId);
    }

    async syncPrices(dataSourceId: string, username: string): Promise<void> {
        throw new ServiceUnavailableException('Эндпоинт временно отключен!');
        // await this.accessService.checkAccessByDataSource(dataSourceId, username);
        // await this.assertActiveForSync(dataSourceId);
        // const adapter = await this.adaptersService.getSyncAdapter(dataSourceId);
        // await adapter.syncPrices(dataSourceId, SyncMode.Force);
    }

    async getOrders(dataSourceId: string, username: string) {
        await this.accessService.checkAccessByDataSource(dataSourceId, username);
        const adapter = await this.adaptersService.getReadAdapter(dataSourceId);
        return await adapter.readOrders(dataSourceId);
    }

    async syncOrders(dataSourceId: string, username: string): Promise<void> {
        throw new ServiceUnavailableException('Эндпоинт временно отключен!');
        // await this.accessService.checkAccessByDataSource(dataSourceId, username);
        // await this.assertActiveForSync(dataSourceId);
        // const adapter = await this.adaptersService.getSyncAdapter(dataSourceId);
        // await adapter.syncOrders(dataSourceId, SyncMode.Force);
    }

    async getFunnel(dataSourceId: string, username: string) {
        await this.accessService.checkAccessByDataSource(dataSourceId, username);
        const adapter = await this.adaptersService.getReadAdapter(dataSourceId);
        return await adapter.readFunnel(dataSourceId);
    }

    async syncFunnel(dataSourceId: string, username: string): Promise<void> {
        throw new ServiceUnavailableException('Эндпоинт временно отключен!');
        // await this.accessService.checkAccessByDataSource(dataSourceId, username);
        // await this.assertActiveForSync(dataSourceId);
        // const adapter = await this.adaptersService.getSyncAdapter(dataSourceId);
        // await adapter.syncFunnel(dataSourceId, SyncMode.Force);
    }

    async getStocks(dataSourceId: string, username: string) {
        await this.accessService.checkAccessByDataSource(dataSourceId, username);
        const adapter = await this.adaptersService.getReadAdapter(dataSourceId);
        return await adapter.readStocks(dataSourceId);
    }

    async syncStocks(dataSourceId: string, username: string): Promise<void> {
        throw new ServiceUnavailableException('Эндпоинт временно отключен!');
        // await this.accessService.checkAccessByDataSource(dataSourceId, username);
        // await this.assertActiveForSync(dataSourceId);
        // const adapter = await this.adaptersService.getSyncAdapter(dataSourceId);
        // await adapter.syncStocks(dataSourceId, SyncMode.Force);
    }

    async getWarehouses(dataSourceId: string, username: string) {
        await this.accessService.checkAccessByDataSource(dataSourceId, username);
        const adapter = await this.adaptersService.getReadAdapter(dataSourceId);
        return await adapter.readWarehouses(dataSourceId);
    }

    async syncWarehouses(dataSourceId: string, username: string): Promise<void> {
        throw new ServiceUnavailableException('Эндпоинт временно отключен!');
        // await this.accessService.checkAccessByDataSource(dataSourceId, username);
        // await this.assertActiveForSync(dataSourceId);
        // const adapter = await this.adaptersService.getSyncAdapter(dataSourceId);
        // await adapter.syncWarehouses(dataSourceId, SyncMode.Force);
    }

    async getAdsCampaigns(dataSourceId: string, username: string) {
        await this.accessService.checkAccessByDataSource(dataSourceId, username);
        const adapter = await this.adaptersService.getReadAdapter(dataSourceId);
        return await adapter.readAdsCampaigns(dataSourceId);
    }

    async syncAdsCampaigns(dataSourceId: string, username: string): Promise<void> {
        throw new ServiceUnavailableException('Эндпоинт временно отключен!');
        // await this.accessService.checkAccessByDataSource(dataSourceId, username);
        // await this.assertActiveForSync(dataSourceId);
        // const adapter = await this.adaptersService.getSyncAdapter(dataSourceId);
        // await adapter.syncAdsCampaigns(dataSourceId, SyncMode.Force);
    }

    async getAdsStats(dataSourceId: string, username: string) {
        await this.accessService.checkAccessByDataSource(dataSourceId, username);
        const adapter = await this.adaptersService.getReadAdapter(dataSourceId);
        return await adapter.readAdsStats(dataSourceId);
    }

    async syncAdsStats(dataSourceId: string, username: string): Promise<void> {
        throw new ServiceUnavailableException('Эндпоинт временно отключен!');
        // await this.accessService.checkAccessByDataSource(dataSourceId, username);
        // await this.assertActiveForSync(dataSourceId);
        // const adapter = await this.adaptersService.getSyncAdapter(dataSourceId);
        // await adapter.syncAdsStats(dataSourceId, SyncMode.Force);
    }
}