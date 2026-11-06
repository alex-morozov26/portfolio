import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProjectEntity } from "../projects/entities/project.entity";
import { Repository } from "typeorm";
import { AdaptersService } from "../adapters/adapters.service";
import pLimit from 'p-limit';
import { DataSourceEntity } from "../data-sources/entities/data-source.entity";
import { SyncMode } from "../adapters/models/sync-mode.enum";
import { DataSourceType } from "../data-sources/models/data-source-type.enum";

@Injectable()
export class SyncService {
    constructor(
        @InjectRepository(ProjectEntity)
        private readonly projectsRepository: Repository<ProjectEntity>,
        private readonly adaptersService: AdaptersService,
    ) {}

    private readonly logger = new Logger(SyncService.name);
    private readonly concurrencyLimit = 5;
    private readonly limit = pLimit(this.concurrencyLimit);

    async autoSyncGeneral() {
        this.logger.log('Запуск автоматической синхронизации общих данных...');
        const projects = await this.getActiveProjects();
        this.logger.log(`Активных проектов для синхронизации: ${projects.length}!`);

        await Promise.all(projects.map(project =>
            this.limit(() => this.projectSyncGeneral(project))
        ))
        this.logger.log('Запуск автоматической синхронизации общих данных завершен!');
    }

    private async projectSyncGeneral(project: ProjectEntity) {
        const startTime = Date.now();
        this.logger.log(`Запуск синхронизации общих данных проекта "${project.name}"...`);
        const activeSources = project.data_sources.filter(ds => ds.is_active);
        this.logger.log(`Проект "${project.name}" — ${activeSources.length} активных источников для синхронизации!`);

        await Promise.all(activeSources.map(dataSource => {
            return this.dataSourceSyncGeneral(project.name, dataSource);
        }))

        this.logger.log(
            `Синхронизация общих данных проекта "${project.name}" завершена за ${(Date.now() - startTime) / 1000} секунд!`
        );
    }

    private async dataSourceSyncGeneral(project: string, dataSource: DataSourceEntity) {
        const startTime = Date.now();
        const adapter = await this.adaptersService.getSyncAdapter(dataSource.id);
        try {
            await adapter.syncGeneral(dataSource.id, SyncMode.Auto);
            this.logger.log(
                `Общие данные источника ${dataSource.id} в проекте "${project}" синхронизированы за ${(Date.now() - startTime) / 1000} секунд!`
            );
        } catch (error) {
            this.logger.warn(
                `Синхронизация общих данных источника ${dataSource.id} в проекте "${project}" не удалась: ${error.message}`
            );
        }
    }

    async autoSyncWbOrders(): Promise<void> {
        this.logger.log('Запуск автоматической синхронизации заказов WB...');
        const projects = await this.getActiveProjects();
        this.logger.log(`Активных проектов для синхронизации: ${projects.length}!`);

        await Promise.all(projects.map(project =>
            this.limit(() => this.projectSyncWbOrders(project))
        ))
        this.logger.log('Запуск автоматической синхронизации заказов WB завершен!');
    }

    private async projectSyncWbOrders(project: ProjectEntity) {
        const startTime = Date.now();
        this.logger.log(`Запуск синхронизации заказов WB проекта "${project.name}"...`);
        const activeSources = project.data_sources.filter(ds => ds.type === DataSourceType.Wb && ds.is_active);
        this.logger.log(`Проект "${project.name}" — ${activeSources.length} активных источников для синхронизации!`);

        await Promise.all(activeSources.map(dataSource => {
            return this.dataSourceSyncWbOrders(project.name, dataSource);
        }))

        this.logger.log(
            `Синхронизация заказов WB проекта "${project.name}" завершена за ${(Date.now() - startTime) / 1000} секунд!`
        );
    }

    private async dataSourceSyncWbOrders(project: string, dataSource: DataSourceEntity) {
        const startTime = Date.now();
        const adapter = await this.adaptersService.getSyncAdapter(dataSource.id);
        try {
            await adapter.syncOrders(dataSource.id, SyncMode.Auto);
            this.logger.log(
                `Заказы WB источника ${dataSource.id} в проекте "${project}" синхронизированы за ${(Date.now() - startTime) / 1000} секунд!`
            );
        } catch (error) {
            this.logger.warn(
                `Синхронизация заказов WB источника ${dataSource.id} в проекте "${project}" не удалась: ${error.message}`
            );
        }
    }

    async autoSyncOzonOrders(): Promise<void> {
        this.logger.log('Запуск автоматической синхронизации заказов Ozon...');
        const projects = await this.getActiveProjects();
        this.logger.log(`Активных проектов для синхронизации: ${projects.length}!`);

        await Promise.all(projects.map(project =>
            this.limit(() => this.projectSyncOzonOrders(project))
        ))
        this.logger.log('Запуск автоматической синхронизации заказов Ozon завершен!');
    }

    private async projectSyncOzonOrders(project: ProjectEntity) {
        const startTime = Date.now();
        this.logger.log(`Запуск синхронизации заказов Ozon проекта "${project.name}"...`);
        const activeSources = project.data_sources.filter(ds => ds.type === DataSourceType.Ozon && ds.is_active);
        this.logger.log(`Проект "${project.name}" — ${activeSources.length} активных источников для синхронизации!`);

        await Promise.all(activeSources.map(dataSource => {
            return this.dataSourceSyncOzonOrders(project.name, dataSource);
        }))

        this.logger.log(
            `Синхронизация заказов Ozon проекта "${project.name}" завершена за ${(Date.now() - startTime) / 1000} секунд!`
        );
    }

    private async dataSourceSyncOzonOrders(project: string, dataSource: DataSourceEntity) {
        const startTime = Date.now();
        const adapter = await this.adaptersService.getSyncAdapter(dataSource.id);
        try {
            await adapter.syncOrders(dataSource.id, SyncMode.Auto);
            this.logger.log(
                `Заказы Ozon источника ${dataSource.id} в проекте "${project}" синхронизированы за ${(Date.now() - startTime) / 1000} секунд!`
            );
        } catch (error) {
            this.logger.warn(
                `Синхронизация заказов Ozon источника ${dataSource.id} в проекте "${project}" не удалась: ${error.message}`
            );
        }
    }

    async autoSyncAds(): Promise<void> {
        this.logger.log('Запуск автоматической синхронизации рекламы...');
        const projects = await this.getActiveProjects();
        this.logger.log(`Активных проектов для синхронизации: ${projects.length}!`);

        await Promise.all(projects.map(project =>
            this.limit(() => this.projectSyncAds(project))
        ))
        this.logger.log('Запуск автоматической синхронизации рекламы завершен!');
    }

    private async projectSyncAds(project: ProjectEntity) {
        const startTime = Date.now();
        this.logger.log(`Запуск синхронизации рекламы проекта "${project.name}"...`);
        const activeSources = project.data_sources.filter(ds => ds.is_active);
        this.logger.log(`Проект "${project.name}" — ${activeSources.length} активных источников для синхронизации!`);

        await Promise.all(activeSources.map(dataSource => {
            return this.dataSourceSyncAds(project.name, dataSource);
        }))

        this.logger.log(
            `Синхронизация рекламы проекта "${project.name}" завершена за ${(Date.now() - startTime) / 1000} секунд!`
        );
    }

    private async dataSourceSyncAds(project: string, dataSource: DataSourceEntity) {
        const startTime = Date.now();
        const adapter = await this.adaptersService.getSyncAdapter(dataSource.id);
        try {
            await adapter.syncAds(dataSource.id, SyncMode.Auto);
            this.logger.log(
                `Реклама источника ${dataSource.id} в проекте "${project}" синхронизирована за ${(Date.now() - startTime) / 1000} секунд!`
            );
        } catch (error) {
            this.logger.warn(
                `Синхронизация рекламы источника ${dataSource.id} в проекте "${project}" не удалась: ${error.message}`
            );
        }
    }

    private async getActiveProjects(): Promise<ProjectEntity[]> {
        return await this.projectsRepository.find({
            where: { is_active: true },
            relations: { data_sources: true }
        })
    }
}