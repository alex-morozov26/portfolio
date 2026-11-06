import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import axios from 'axios';
import { WbOrderEntity } from './entities/wb-order.entity';
import { sleep } from 'src/utils/sleep';
import { SyncSnapshotsService } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.service';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { SyncResult } from 'src/modules/sync/modules/sync-snapshots/models/sync-result.interface';
import { WbOrdersCleanupOptions } from './models/orders-cleanup-options.interface';
import { chunkArray } from 'src/utils/chunk-array';
import { excludeSnapshots } from 'src/utils/exclude-snapshots';

@Injectable()
export class WbOrdersService {
    private readonly logger = new Logger(WbOrdersService.name);
    private readonly apiUrl = 'https://statistics-api.wildberries.ru/api/v1/supplier/orders';

    constructor(
        private readonly dataSource: DataSource,
        private readonly syncSnapshotsService: SyncSnapshotsService
    ) { }

    private async *streamOrders(apiToken: string) {
        const dateRange = this.getDateRange();

        for (let i = 0; i < dateRange.length; i++) {
            const date = dateRange[i];

            const { data } = await axios.get(this.apiUrl, {
                headers: {
                    Authorization: apiToken,
                    'Content-Type': 'application/json',
                },
                params: {
                    dateFrom: date,
                    flag: 1
                }
            });

            const orders = data ?? [];

            yield [orders, date];

            if (i < dateRange.length - 1) {
                await sleep(60000);
            }
        }
    }

    private getDateRange(): string[] {
        const result: string[] = [];
        const today = new Date();
        const todayDate = today.getDate()

        for (let i = 0; i < 90; i++) {
            const date = new Date(today);
            date.setDate(todayDate - i);
            result.push(date.toISOString().slice(0, 10));
        }

        return result;
    }

    private mapToEntity(manager: EntityManager, dataSourceId: string, snapshotId: string, order: any): WbOrderEntity {
        return manager.create(WbOrderEntity, {
            datasource_id: dataSourceId,
            snapshot_id: snapshotId,
            srid: order.srid,
            date: new Date(order.date),
            last_change_date: new Date(order.lastChangeDate),
            warehouse_name: order.warehouseName,
            warehouse_type: order.warehouseType,
            country_name: order.countryName,
            oblast_okrug_name: order.oblastOkrugName,
            region_name: order.regionName,
            supplier_article: order.supplierArticle,
            nm_id: order.nmId,
            barcode: order.barcode,
            category: order.category,
            subject: order.subject,
            brand: order.brand,
            tech_size: order.techSize,
            income_id: order.incomeID,
            is_supply: order.isSupply,
            is_realization: order.isRealization,
            total_price: order.totalPrice,
            discount_percent: order.discountPercent,
            spp: order.spp,
            finished_price: order.finishedPrice,
            price_with_disc: order.priceWithDisc,
            is_cancel: order.isCancel,
            cancel_date: new Date(order.cancelDate),
            sticker: order.sticker,
            g_number: order.gNumber
        })
    }

    private async cleanupOrders(manager: EntityManager, options: WbOrdersCleanupOptions) {
        const chunkSize = 300;

        if (options.snapshotId && options.srids && options.srids.length > 0) {
            const chunks = chunkArray<string>(options.srids, chunkSize);
            for (const chunk of chunks) {
                await manager.getRepository(WbOrderEntity).delete({
                    datasource_id: options.datasourceId,
                    snapshot_id: Not(options.snapshotId),
                    srid: In(chunk)
                });
            }
        } else if (options.snapshotId) {
            await manager.getRepository(WbOrderEntity).delete({
                datasource_id: options.datasourceId,
                snapshot_id: options.snapshotId
            });
        }
    }

    async syncOrders(apiToken: string, dataSourceId: string, mode: SyncMode): Promise<SyncResult> {
        const manager = this.dataSource.manager;
        const snapshot = await this.syncSnapshotsService.create(dataSourceId, SyncScope.Orders, mode);
        const ordersRepository = this.dataSource.getRepository(WbOrderEntity);

        try {
            const newOrdersSrids = new Set<string>();

            for await (const [orders, date] of this.streamOrders(apiToken)) {
                const ordersToSave = orders.map(order => this.mapToEntity(
                    manager, dataSourceId, snapshot.id, order
                ));
                ordersToSave.forEach(order => newOrdersSrids.add(order.srid));
                await ordersRepository.save(ordersToSave, { chunk: 100 });
                this.logger.log(`Чанк из ${ordersToSave.length} заказов за ${date} записан (snapshot ${snapshot.id})`);
            }

            await this.dataSource.transaction(async (manager: EntityManager) => {
                const oldSnapshot = await this.syncSnapshotsService.getActive(dataSourceId, SyncScope.Orders);
                
                if (oldSnapshot) {
                    await this.syncSnapshotsService.archive(manager, oldSnapshot.id);
                }

                await this.cleanupOrders(manager, {
                    datasourceId: dataSourceId,
                    snapshotId: snapshot.id,
                    srids: Array.from(newOrdersSrids)
                })

                await this.syncSnapshotsService.activate(manager, snapshot.id);
            });

            return {
                snapshotId: snapshot.id,
                success: true
            }
        } catch (error) {
            await this.cleanupOrders(manager, {
                datasourceId: dataSourceId,
                snapshotId: snapshot.id
            })
            await this.syncSnapshotsService.fail(snapshot.id);
            this.logger.error('Ошибка при синхронизации WB заказов!', error);
            return {
                snapshotId: snapshot.id,
                success: false,
                error: `Ошибка при синхронизации заказов: ${error?.message || 'Неизвестная ошибка'}`
            }
        }
    }

    async getAllOrders(dataSourceId: string) {
        const snapshotsInProgress = await this.syncSnapshotsService.getLoading(dataSourceId, SyncScope.Orders);
        const snapshotsIds = snapshotsInProgress.map(s => s.id);
        const snapshotsCriteria = excludeSnapshots(snapshotsIds);

        const repository = this.dataSource.getRepository(WbOrderEntity);
        const limit = 100;
        const offset = 0;

        const [orders, total] = await Promise.all([
            repository.find({
                where: {
                    datasource_id: dataSourceId,
                    snapshot_id: snapshotsCriteria
                },
                order: { date: 'DESC' },
                take: limit,
                skip: offset
            }),
            repository.count({
                where: {
                    datasource_id: dataSourceId,
                    snapshot_id: snapshotsCriteria
                }
            })
        ])

        return { 
            results: orders,
            count: total,
            offset: offset,
            limit: limit
        };                
    }
}
