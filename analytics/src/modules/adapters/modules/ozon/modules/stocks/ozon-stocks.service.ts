import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import axios from 'axios';
import { OzonProductEntity } from '../products/entities/ozon-product.entity';
import { OzonStockEntity } from './entities/ozon-stock.entity';
import { SyncSnapshotsService } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.service';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { chunkArray } from 'src/utils/chunk-array';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { SyncResult } from 'src/modules/sync/modules/sync-snapshots/models/sync-result.interface';
import { OzonStocksCleanupOptions } from './models/stocks-cleanup-options.interface';
import { excludeSnapshots } from 'src/utils/exclude-snapshots';

@Injectable()
export class OzonStocksService {
    private readonly logger = new Logger(OzonStocksService.name);
    private readonly apiUrl = 'https://api-seller.ozon.ru/v1/analytics/stocks';

    constructor(
        private readonly dataSource: DataSource,
        private readonly syncSnapshotsService: SyncSnapshotsService
    ) { }

    private async *streamStocks(clientId: string, apiKey: string, dataSourceId: string) {
        const limit = 100;

        const snapshot = await this.syncSnapshotsService.getActive(dataSourceId, SyncScope.Products);
        if (!snapshot) {
            yield [];
            return;
        }

        const products = await this.dataSource.getRepository(OzonProductEntity).find({
            select: {
                sku: true
            },
            where: {
                datasource_id: dataSourceId,
                snapshot_id: snapshot.id
            }
        });
        const skus = products.map(product => product.sku);

        const chunks = chunkArray<string>(skus, limit);
        const options = {
            headers: {
                'Client-Id': clientId,
                'Api-Key': apiKey,
                'Content-Type': 'application/json',
            }
        }

        for (const chunk of chunks) {
            const payload = {
                skus: chunk
            }

            const { data } = await axios.post(this.apiUrl, payload, options);
            const stocks = data.items || [];

            yield stocks;
        }
    }

    private makeIdentity(sku: string, clusterId: string, warehouseId: string): string {
        return `${sku}-${clusterId}-${warehouseId}`;
    }

    private mapToEntity(manager: EntityManager, dataSourceId: string, snapshotId: string, stock: any): OzonStockEntity {
        return manager.create(OzonStockEntity, {
            identity: this.makeIdentity(stock.sku, stock.cluster_id, stock.warehouse_id),
            datasource_id: dataSourceId,
            snapshot_id: snapshotId,
            ads: stock.ads,
            ads_cluster: stock.ads_cluster,
            available_stock_count: stock.available_stock_count,
            cluster_id: stock.cluster_id,
            cluster_name: stock.cluster_name,
            days_without_sales: stock.days_without_sales,
            days_without_sales_cluster: stock.days_without_sales_cluster,
            excess_stock_count: stock.excess_stock_count,
            expiring_stock_count: stock.expiring_stock_count,
            idc: stock.idc,
            idc_cluster: stock.idc_cluster,
            item_tags: stock.item_tags,
            name: stock.name,
            offer_id: stock.offer_id,
            other_stock_count: stock.other_stock_count,
            requested_stock_count: stock.requested_stock_count,
            return_from_customer_stock_count: stock.return_from_customer_stock_count,
            return_to_seller_stock_count: stock.return_to_seller_stock_count,
            sku: stock.sku,
            stock_defect_stock_count: stock.stock_defect_stock_count,
            transit_defect_stock_count: stock.transit_defect_stock_count,
            transit_stock_count: stock.transit_stock_count,
            turnover_grade: stock.turnover_grade,
            turnover_grade_cluster: stock.turnover_grade_cluster,
            valid_stock_count: stock.valid_stock_count,
            waiting_docs_stock_count: stock.waiting_docs_stock_count,
            warehouse_id: stock.warehouse_id,
            warehouse_name: stock.warehouse_name
        });
    }

    private async cleanupStocks(manager: EntityManager, options: OzonStocksCleanupOptions) {
        const chunkSize = 300;

        if (options.snapshotId && options.identities && options.identities.length > 0) {
            const chunks = chunkArray<string>(options.identities, chunkSize);
            for (const chunk of chunks) {
                await manager.getRepository(OzonStockEntity).delete({
                    datasource_id: options.datasourceId,
                    snapshot_id: Not(options.snapshotId),
                    identity: In(chunk)
                });
            }
        } else if (options.snapshotId) {
            await manager.getRepository(OzonStockEntity).delete({
                datasource_id: options.datasourceId,
                snapshot_id: options.snapshotId
            });
        }
    }

    async syncStocks(clientId: string, apiKey: string, dataSourceId: string, mode: SyncMode): Promise<SyncResult> {
        const manager = this.dataSource.manager;
        const snapshot = await this.syncSnapshotsService.create(dataSourceId, SyncScope.Stocks, mode);
        const stocksRepository = this.dataSource.getRepository(OzonStockEntity);

        try {
            const newStocksIdentities = new Set<string>();

            for await (const stocks of this.streamStocks(clientId, apiKey, dataSourceId)) {
                const stocksToSave = stocks.map(stock => this.mapToEntity(
                    manager, dataSourceId, snapshot.id, stock
                ));
                stocksToSave.map(stock => newStocksIdentities.add(stock.identity));
                await stocksRepository.save(stocksToSave, { chunk: 100 });
                this.logger.log(`Чанк из ${stocksToSave.length} остатков записан (snapshot ${snapshot.id})`);
            }

            await this.dataSource.transaction(async (manager: EntityManager) => {
                const oldSnapshot = await this.syncSnapshotsService.getActive(dataSourceId, SyncScope.Stocks);
                
                if (oldSnapshot) {
                    await this.syncSnapshotsService.archive(manager, oldSnapshot.id);
                }

                await this.cleanupStocks(manager, {
                    datasourceId: dataSourceId,
                    snapshotId: snapshot.id,
                    identities: Array.from(newStocksIdentities)
                })

                await this.syncSnapshotsService.activate(manager, snapshot.id);
            });

            return {
                snapshotId: snapshot.id,
                success: true
            }
        } catch (error) {
            await this.cleanupStocks(manager, {
                datasourceId: dataSourceId,
                snapshotId: snapshot.id
            })
            await this.syncSnapshotsService.fail(snapshot.id);
            this.logger.error('Ошибка при синхронизации Ozon остатков!', error);
            return {
                snapshotId: snapshot.id,
                success: false,
                error: `Ошибка при синхронизации остатков: ${error?.message || 'Неизвестная ошибка'}`
            }
        }
    }

    async getAllStocks(dataSourceId: string) {
        const snapshotsInProgress = await this.syncSnapshotsService.getLoading(dataSourceId, SyncScope.Stocks);
        const snapshotsIds = snapshotsInProgress.map(s => s.id);

        return this.dataSource.getRepository(OzonStockEntity).find({
            where: {
                datasource_id: dataSourceId,
                snapshot_id: excludeSnapshots(snapshotsIds)
            }
        })
    }
}
