import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import axios from 'axios';
import { WbStockEntity } from './entities/wb-stock.entity';
import { WbStockMetricEntity } from './entities/wb-stock-metric.entity';
import { WbStockAvgOrdersMonthEntity } from './entities/wb-stock-avg-orders-month.entity';
import { WbStockCurrentPriceEntity } from './entities/wb-stock-current-price.entity';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { SyncResult } from 'src/modules/sync/modules/sync-snapshots/models/sync-result.interface';
import { SyncSnapshotsService } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.service';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { chunkArray } from 'src/utils/chunk-array';
import { WbStocksCleanupOptions } from './models/stocks-cleanup-options.interface';
import { WbStockSaleRateEntity } from './entities/wb-stock-sale-rate.entity';
import { WbStockAvgStockTurnoverEntity } from './entities/wb-stock-avg-stock-turnover.entity';
import { WbStockOfficeMissingTimeEntity } from './entities/wb-stock-office-missing-time.entity';
import { excludeSnapshots } from 'src/utils/exclude-snapshots';

@Injectable()
export class WbStocksService {
    private readonly logger = new Logger(WbStocksService.name);
    private readonly apiUrl = 'https://seller-analytics-api.wildberries.ru/api/v2/stocks-report/products/products';

    constructor(
        private readonly dataSource: DataSource,
        private readonly syncSnapshotsService: SyncSnapshotsService
    ) { }

    private async *streamStocks(apiToken: string) {
        const limit = 1000
        let offset = 0
        const dateRange = this.getDateRange();

        do {
            const payload = {
                currentPeriod: {
                    start: dateRange.start,
                    end: dateRange.end
                },
                stockType: "wb",
                skipDeletedNm: true,
                orderBy: {
                    field: "stockCount",
                    mode: "desc"
                },
                availabilityFilters: [],
                limit: limit,
                offset: offset
            };

            const { data } = await axios.post(this.apiUrl, payload, {
                headers: {
                    Authorization: apiToken,
                    'Content-Type': 'application/json',
                }
            });

            const stocks = data.data.items ?? [];
            if (!stocks.length) break;

            yield stocks;

            offset += limit
            if (data?.data?.items?.length !== limit) break
        } while (true);
    }

    private getDateRange() {
        const end = new Date();
        const start = new Date(end);
        start.setMonth(start.getMonth() - 3);
        start.setDate(start.getDate() + 1);

        return {
            start: start.toISOString().slice(0, 10),
            end: end.toISOString().slice(0, 10)
        };
    }

    private mapToEntity(manager: EntityManager, dataSourceId: string, snapshotId: string, stock: any): WbStockEntity {
        return manager.create(WbStockEntity, {
            datasource_id: dataSourceId,
            snapshot_id: snapshotId,
            nm_id: stock.nmID,
            is_deleted: stock.isDeleted,
            subject_name: stock.subjectName,
            name: stock.name,
            vendor_code: stock.vendorCode,
            brand_name: stock.brandName,
            main_photo: stock.mainPhoto,
            has_sizes: stock.hasSizes,
            metrics: manager.create(WbStockMetricEntity, {
                orders_count: stock.metrics.ordersCount,
                orders_sum: stock.metrics.ordersSum,
                avg_orders: stock.metrics.avgOrders,
                buyout_count: stock.metrics.buyoutCount,
                buyout_sum: stock.metrics.buyoutSum,
                buyout_percent: stock.metrics.buyoutPercent,
                stock_count: stock.metrics.stockCount,
                stock_sum: stock.metrics.stockSum,
                to_client_count: stock.metrics.toClientCount,
                from_client_count: stock.metrics.fromClientCount,
                lost_orders_count: stock.metrics.lostOrdersCount,
                lost_orders_sum: stock.metrics.lostOrdersSum,
                lost_buyouts_count: stock.metrics.lostBuyoutsCount,
                lost_buyouts_sum: stock.metrics.lostBuyoutsSum,
                availability: stock.metrics.availability,
                avg_orders_by_month: (stock.metrics.avgOrdersByMonth || []).map(avg =>
                    manager.create(WbStockAvgOrdersMonthEntity, {
                        start: avg.start,
                        end: avg.end,
                        value: avg.value
                    })
                ),
                sale_rate: manager.create(WbStockSaleRateEntity, {
                    days: stock.metrics.saleRate.days,
                    hours: stock.metrics.saleRate.hours
                }),
                avg_stock_turnover: manager.create(WbStockAvgStockTurnoverEntity, {
                    days: stock.metrics.avgStockTurnover.days,
                    hours: stock.metrics.avgStockTurnover.hours
                }),
                office_missing_time: manager.create(WbStockOfficeMissingTimeEntity, {
                    days: stock.metrics.officeMissingTime.days,
                    hours: stock.metrics.officeMissingTime.hours
                }),
                current_price: manager.create(WbStockCurrentPriceEntity, {
                    min_price: stock.metrics.currentPrice.minPrice,
                    max_price: stock.metrics.currentPrice.maxPrice
                })
            })
        })
    }

    private async cleanupStocks(manager: EntityManager, options: WbStocksCleanupOptions) {
        const chunkSize = 300;

        if (options.snapshotId && options.nmIds && options.nmIds.length > 0) {
            const chunks = chunkArray<string>(options.nmIds, chunkSize);
            for (const chunk of chunks) {
                await manager.getRepository(WbStockEntity).delete({
                    datasource_id: options.datasourceId,
                    snapshot_id: Not(options.snapshotId),
                    nm_id: In(chunk)
                });
            }
        } else if (options.snapshotId) {
            await manager.getRepository(WbStockEntity).delete({
                datasource_id: options.datasourceId,
                snapshot_id: options.snapshotId
            });
        }
    }

    async syncStocks(apiToken: string, dataSourceId: string, mode: SyncMode): Promise<SyncResult> {
        const manager = this.dataSource.manager;
        const snapshot = await this.syncSnapshotsService.create(dataSourceId, SyncScope.Stocks, mode);
        const stocksRepository = this.dataSource.getRepository(WbStockEntity);

        try {
            const newStocksNmIds = new Set<string>();

            for await (const stocks of this.streamStocks(apiToken)) {
                const stocksToSave = stocks.map(stock => this.mapToEntity(
                    manager, dataSourceId, snapshot.id, stock
                ));
                stocksToSave.forEach(stock => newStocksNmIds.add(stock.nm_id));
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
                    nmIds: Array.from(newStocksNmIds)
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
            this.logger.error('Ошибка при синхронизации WB остатков!', error);
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

        return this.dataSource.getRepository(WbStockEntity).find({
            where: {
                datasource_id: dataSourceId,
                snapshot_id: excludeSnapshots(snapshotsIds)
            },
            relations: {
                metrics: {
                    avg_orders_by_month: true,
                    sale_rate: true,
                    avg_stock_turnover: true,
                    office_missing_time: true,
                    current_price: true
                }
            }
        })
    }
}
