import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import axios from 'axios';
import { WbPriceEntity } from './entities/wb-price.entity';
import { WbPriceSizeEntity } from './entities/wb-price-size.entity';
import { SyncSnapshotsService } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.service';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { SyncResult } from 'src/modules/sync/modules/sync-snapshots/models/sync-result.interface';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { WbPricesCleanupOptions } from './models/prices-cleanup-options.interface';
import { chunkArray } from 'src/utils/chunk-array';
import { excludeSnapshots } from 'src/utils/exclude-snapshots';

@Injectable()
export class WbPricesService {
    private readonly logger = new Logger(WbPricesService.name);
    private readonly apiUrl = 'https://discounts-prices-api.wildberries.ru/api/v2/list/goods/filter';

    constructor(
        private readonly dataSource: DataSource,
        private readonly syncSnapshotsService: SyncSnapshotsService
    ) { }

    private async *streamPrices(apiToken: string) {
        const limit = 1000;
        let offset = 0;

        do {
            const { data } = await axios.get(this.apiUrl, {
                headers: {
                    Authorization: apiToken,
                    'Content-Type': 'application/json',
                },
                params: {
                    limit: limit,
                    offset: offset
                }
            });

            const prices = data.data.listGoods ?? [];
            if (!prices.length) break;

            yield prices;

            offset += limit;
            if (data?.data?.listGoods?.length !== limit) break
        } while (true);
    }

    private mapToEntity(manager: EntityManager, dataSourceId: string, snapshotId: string, price: any): WbPriceEntity {
        return manager.create(WbPriceEntity, {
            datasource_id: dataSourceId,
            snapshot_id: snapshotId,
            nm_id: price.nmID,
            vendor_code: price.vendorCode,
            currency_iso_code_4217: price.currencyIsoCode4217,
            discount: price.discount,
            club_discount: price.clubDiscount,
            editable_size_price: price.editableSizePrice,
            is_bad_turnover: price.isBadTurnover,
            sizes: (price.sizes || []).map(size => 
                manager.create(WbPriceSizeEntity, {
                    sizeID: size.sizeID,
                    price: size.price,
                    discountedPrice: size.discountedPrice,
                    clubDiscountedPrice: size.clubDiscountedPrice,
                    techSizeName: size.techSizeName
                })
            )
        })
    }

    private async cleanupPrices(manager: EntityManager, options: WbPricesCleanupOptions) {
        const chunkSize = 300;

        if (options.snapshotId && options.nmIds && options.nmIds.length > 0) {
            const chunks = chunkArray<string>(options.nmIds, chunkSize);
            for (const chunk of chunks) {
                await manager.getRepository(WbPriceEntity).delete({
                    datasource_id: options.datasourceId,
                    snapshot_id: Not(options.snapshotId),
                    nm_id: In(chunk)
                });
            }
        } else if (options.snapshotId) {
            await manager.getRepository(WbPriceEntity).delete({
                datasource_id: options.datasourceId,
                snapshot_id: options.snapshotId
            });
        }
    }

    async syncPrices(apiToken: string, dataSourceId: string, mode: SyncMode): Promise<SyncResult> {
        const manager = this.dataSource.manager;
        const snapshot = await this.syncSnapshotsService.create(dataSourceId, SyncScope.Prices, mode);
        const pricesRepository = this.dataSource.getRepository(WbPriceEntity);

        try {
            const newPricesNmIds = new Set<string>();

            for await (const prices of this.streamPrices(apiToken)) {
                const pricesToSave = prices.map(price => this.mapToEntity(
                    manager, dataSourceId, snapshot.id, price
                ));
                pricesToSave.forEach(price => newPricesNmIds.add(price.nm_id));
                await pricesRepository.save(pricesToSave, { chunk: 100 });
                this.logger.log(`Чанк из ${pricesToSave.length} цен записан (snapshot ${snapshot.id})`);
            }

            await this.dataSource.transaction(async (manager: EntityManager) => {
                const oldSnapshot = await this.syncSnapshotsService.getActive(dataSourceId, SyncScope.Prices);
                
                if (oldSnapshot) {
                    await this.syncSnapshotsService.archive(manager, oldSnapshot.id);
                }

                await this.cleanupPrices(manager, {
                    datasourceId: dataSourceId,
                    snapshotId: snapshot.id,
                    nmIds: Array.from(newPricesNmIds)
                })

                await this.syncSnapshotsService.activate(manager, snapshot.id);
            });

            return {
                snapshotId: snapshot.id,
                success: true
            }
        } catch (error) {
            await this.cleanupPrices(manager, {
                datasourceId: dataSourceId,
                snapshotId: snapshot.id
            })
            await this.syncSnapshotsService.fail(snapshot.id);
            this.logger.error('Ошибка при синхронизации WB цен!', error);
            return {
                snapshotId: snapshot.id,
                success: false,
                error: `Ошибка при синхронизации цен: ${error?.message || 'Неизвестная ошибка'}`
            }
        }
    }

    async getAllPrices(dataSourceId: string) {
        const snapshotsInProgress = await this.syncSnapshotsService.getLoading(dataSourceId, SyncScope.Prices);
        const snapshotsIds = snapshotsInProgress.map(s => s.id);

        return this.dataSource.getRepository(WbPriceEntity).find({
            where: {
                datasource_id: dataSourceId,
                snapshot_id: excludeSnapshots(snapshotsIds)
            },
            relations: {
                sizes: true
            }
        })
    }
}
