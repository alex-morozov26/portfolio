import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import axios from 'axios';
import { OzonProductEntity } from '../products/entities/ozon-product.entity';
import { OzonPriceEntity } from './entities/ozon-price.entity';
import { OzonPriceCommissionEntity } from './entities/ozon-price-commission.entity';
import { OzonPriceMarketingActionEntity } from './entities/ozon-price-marketing-action.entity';
import { OzonPriceMarketingActionDataEntity } from './entities/ozon-price-marketing-action-data.entity';
import { OzonPriceDataEntity } from './entities/ozon-price-data.entity';
import { OzonPriceIndexEntity } from './entities/ozon-price-index.entity';
import { SyncSnapshotsService } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.service';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { chunkArray } from 'src/utils/chunk-array';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { SyncResult } from 'src/modules/sync/modules/sync-snapshots/models/sync-result.interface';
import { OzonPriceExternalIndexDataEntity } from './entities/ozon-price-external-index-data.entity';
import { OzonPriceOzonIndexDataEntity } from './entities/ozon-price-ozon-index-data.entity';
import { OzonPriceMarketplacesIndexDataEntity } from './entities/ozon-price-marketplaces-index-data.entity';
import { OzonPricesCleanupOptions } from './models/prices-cleanup-options.interface';
import { excludeSnapshots } from 'src/utils/exclude-snapshots';

@Injectable()
export class OzonPricesService {
    private readonly logger = new Logger(OzonPricesService.name);
    private readonly apiUrl = 'https://api-seller.ozon.ru/v5/product/info/prices';

    constructor(
        private readonly dataSource: DataSource,
        private readonly syncSnapshotsService: SyncSnapshotsService
    ) { }

    private async *streamPrices(clientId: string, apiKey: string, dataSourceId: string) {
        const limit = 1000;
        const snapshot = await this.syncSnapshotsService.getActive(dataSourceId, SyncScope.Products);
        if (!snapshot) {
            yield [];
            return;
        }
        const products = await this.dataSource.getRepository(OzonProductEntity).find({
            where: {
                datasource_id: dataSourceId,
                snapshot_id: snapshot.id
            },
            select: {
                product_id: true
            }
        })
        const productIds = products.map(product => product.product_id);
        const chunks = chunkArray<string>(productIds, limit);

        const options = {
            headers: {
                'Client-Id': clientId,
                'Api-Key': apiKey,
                'Content-Type': 'application/json',
            }
        }

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];

            const payload = {
                cursor: "",
                filter: { product_id: chunk },
                limit: limit
            }

            const { data } = await axios.post(this.apiUrl, payload, options);
            const prices = data.items ?? [];

            yield prices;
        }
    }

    private mapToEntity(manager: EntityManager, dataSourceId: string, snapshotId: string, price: any): OzonPriceEntity {
        return manager.create(OzonPriceEntity, {
            datasource_id: dataSourceId,
            snapshot_id: snapshotId,
            acquiring: price.acquiring,
            offer_id: price.offer_id,
            product_id: price.product_id,
            volume_weight: price.volume_weight,
            commissions: manager.create(OzonPriceCommissionEntity, {
                fbo_deliv_to_customer_amount: price.commissions.fbo_deliv_to_customer_amount,
                fbo_direct_flow_trans_max_amount: price.commissions.fbo_direct_flow_trans_max_amount,
                fbo_direct_flow_trans_min_amount: price.commissions.fbo_direct_flow_trans_min_amount,
                fbo_return_flow_amount: price.commissions.fbo_return_flow_amount,
                fbs_deliv_to_customer_amount: price.commissions.fbs_deliv_to_customer_amount,
                fbs_direct_flow_trans_max_amount: price.commissions.fbs_direct_flow_trans_max_amount,
                fbs_direct_flow_trans_min_amount: price.commissions.fbs_direct_flow_trans_min_amount,
                fbs_first_mile_max_amount: price.commissions.fbs_first_mile_max_amount,
                fbs_first_mile_min_amount: price.commissions.fbs_first_mile_min_amount,
                fbs_return_flow_amount: price.commissions.fbs_return_flow_amount,
                sales_percent_fbo: price.commissions.sales_percent_fbo,
                sales_percent_fbp: price.commissions.sales_percent_fbp,
                sales_percent_fbs: price.commissions.sales_percent_fbs,
                sales_percent_rfbs: price.commissions.sales_percent_rfbs
            }),
            marketing_actions: manager.create(OzonPriceMarketingActionEntity, {
                current_period_from: new Date(price.marketing_actions.current_period_from),
                current_period_to: new Date(price.marketing_actions.current_period_to),
                ozon_actions_exist: price.marketing_actions.ozon_actions_exist,
                actions: (price.marketing_actions.actions || []).map(action =>
                    manager.create(OzonPriceMarketingActionDataEntity, {
                        title: action.title,
                        value: action.value,
                        date_from: new Date(action.date_from),
                        date_to: new Date(action.date_to)
                    })
                )
            }),
            price: manager.create(OzonPriceDataEntity, {
                auto_action_enabled: price.price.auto_action_enabled,
                auto_add_to_ozon_actions_list_enabled: price.price.auto_add_to_ozon_actions_list_enabled,
                currency_code: price.price.currency_code,
                marketing_seller_price: price.price.marketing_seller_price,
                min_price: price.price.min_price,
                net_price: price.price.net_price,
                old_price: price.price.old_price,
                price: price.price.price,
                retail_price: price.price.retail_price,
                vat: price.price.vat
            }),
            price_indexes: manager.create(OzonPriceIndexEntity, {
                color_index: price.price_indexes.color_index,
                external_index_data: manager.create(OzonPriceExternalIndexDataEntity, {
                    min_price: price.price_indexes.external_index_data.min_price,
                    min_price_currency: price.price_indexes.external_index_data.min_price_currency,
                    price_index_value: price.price_indexes.external_index_data.price_index_value
                }),
                ozon_index_data: manager.create(OzonPriceOzonIndexDataEntity, {
                    min_price: price.price_indexes.ozon_index_data.min_price,
                    min_price_currency: price.price_indexes.ozon_index_data.min_price_currency,
                    price_index_value: price.price_indexes.ozon_index_data.price_index_value
                }),
                self_marketplaces_index_data: manager.create(OzonPriceMarketplacesIndexDataEntity, {
                    min_price: price.price_indexes.self_marketplaces_index_data.min_price,
                    min_price_currency: price.price_indexes.self_marketplaces_index_data.min_price_currency,
                    price_index_value: price.price_indexes.self_marketplaces_index_data.price_index_value
                })
            })
        });
    }

    private async cleanupPrices(manager: EntityManager, options: OzonPricesCleanupOptions) {
        const chunkSize = 300;

        if (options.snapshotId && options.productIds && options.productIds.length > 0) {
            const chunks = chunkArray<string>(options.productIds, chunkSize);
            for (const chunk of chunks) {
                await manager.getRepository(OzonPriceEntity).delete({
                    datasource_id: options.datasourceId,
                    snapshot_id: Not(options.snapshotId),
                    product_id: In(chunk)
                });
            }
        } else if (options.snapshotId) {
            await manager.getRepository(OzonPriceEntity).delete({
                datasource_id: options.datasourceId,
                snapshot_id: options.snapshotId
            });
        }
    }

    async syncPrices(clientId: string, apiKey: string, dataSourceId: string, mode: SyncMode): Promise<SyncResult> {
        const manager = this.dataSource.manager;
        const snapshot = await this.syncSnapshotsService.create(dataSourceId, SyncScope.Prices, mode);
        const pricesRepository = this.dataSource.getRepository(OzonPriceEntity);
        
        try {
            const newPricesProductIds = new Set<string>();

            for await (const prices of this.streamPrices(clientId, apiKey, dataSourceId)) {
                const pricesToSave = prices.map(price => this.mapToEntity(
                    manager, dataSourceId, snapshot.id, price
                ));
                pricesToSave.forEach(price => newPricesProductIds.add(price.product_id));
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
                    productIds: Array.from(newPricesProductIds)
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
            this.logger.error('Ошибка при синхронизации Ozon цен!', error);
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

        return this.dataSource.getRepository(OzonPriceEntity).find({
            where: {
                datasource_id: dataSourceId,
                snapshot_id: excludeSnapshots(snapshotsIds)
            },
            relations: {
                commissions: true,
                marketing_actions: {
                    actions: true
                },
                price: true,
                price_indexes: {
                    external_index_data: true,
                    ozon_index_data: true,
                    self_marketplaces_index_data: true
                }
            }
        })
    }
}
