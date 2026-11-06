import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import axios from 'axios';
import { OzonProductEntity } from './entities/ozon-product.entity';
import { OzonProductQuantEntity } from './entities/ozon-product-quant.entity';
import { OzonProductAvailabilityEntity } from './entities/ozon-product-availability.entity';
import { OzonProductAvailabilityReasonEntity } from './entities/ozon-product-availability-reason.entity';
import { OzonProductCommissionEntity } from './entities/ozon-product-commission.entity';
import { OzonProductErrorEntity } from './entities/ozon-product-error.entity';
import { OzonProductErrorParameterEntity } from './entities/ozon-product-error-parameter.entity';
import { OzonProductModelEntity } from './entities/ozon-product-model.entity';
import { OzonProductPriceIndexEntity } from './entities/ozon-product-price-index.entity';
import { OzonProductPromotionEntity } from './entities/ozon-product-promotion.entity';
import { OzonProductSourceEntity } from './entities/ozon-product-source.entity';
import { OzonProductStatusEntity } from './entities/ozon-product-status.entity';
import { OzonProductStockEntity } from './entities/ozon-product-stock.entity';
import { OzonProductStockDataEntity } from './entities/ozon-product-stock-data.entity';
import { OzonProductVisibilityDetailEntity } from './entities/ozon-product-visibility-detail.entity';
import { SyncSnapshotsService } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.service';
import { SyncResult } from 'src/modules/sync/modules/sync-snapshots/models/sync-result.interface';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { chunkArray } from 'src/utils/chunk-array';
import { OzonProductPriceExternalIndexDataEntity } from './entities/ozon-product-price-external-index-data.entity';
import { OzonProductPriceOzonIndexDataEntity } from './entities/ozon-product-price-ozon-index-data.entity';
import { OzonProductPriceMarketplacesIndexDataEntity } from './entities/ozon-product-price-marketplaces-index-data.entity';
import { OzonProductsCleanupOptions } from './models/products-cleanup-options.interface';
import { excludeSnapshots } from 'src/utils/exclude-snapshots';

@Injectable()
export class OzonProductsService {
    private readonly logger = new Logger(OzonProductsService.name);
    private readonly apiListUrl = 'https://api-seller.ozon.ru/v3/product/list';
    private readonly apiInfoUrl = 'https://api-seller.ozon.ru/v3/product/info/list'

    constructor(
        private readonly dataSource: DataSource,
        private readonly syncSnapshotsService: SyncSnapshotsService
    ) { }

    private async *streamProducts(clientId: string, apiKey: string) {
        let last_id: string = "";
        const limit = 1000;

        const options = {
            headers: {
                'Client-Id': clientId,
                'Api-Key': apiKey,
                'Content-Type': 'application/json',
            }
        }

        do {
            const listPayload = {
                filter: {},
                limit: limit,
                last_id: last_id
            };

            const { data: productsList } = await axios.post(this.apiListUrl, listPayload, options);
            const listItems = productsList.result.items ?? [];

            if (!listItems.length) break;

            const productIds: number[] = [];
            const listInfoMap: {[key: number]: any} = {};
            
            listItems.forEach(item => {
                productIds.push(item.product_id);
                listInfoMap[item.product_id] = item;
            })

            const { data: productsInfo } = await axios.post(this.apiInfoUrl, {
                product_id: productIds
            }, options);

            const products = (productsInfo.items ?? []).map(product => ({
                listInfo: listInfoMap[product.id],
                ...product
            }));

            if (!products.length) break;

            yield products;

            last_id = productsList.result.last_id;
            if (products.length < limit) break;

        } while (true);
    }

    private mapToEntity(manager: EntityManager, dataSourceId: string, snapshotId: string, product: any): OzonProductEntity {
        return manager.create(OzonProductEntity, {
            datasource_id: dataSourceId,
            snapshot_id: snapshotId,
            is_archived: product.listInfo.archived,
            has_fbo_stocks: product.listInfo.has_fbo_stocks,
            has_fbs_stocks: product.listInfo.has_fbs_stocks,
            is_discounted: product.listInfo.is_discounted,
            offer_id: product.listInfo.offer_id,
            product_id: product.listInfo.product_id,
            barcodes: product.barcodes,
            color_image: product.color_image,
            created_at: new Date(product.created_at),
            currency_code: product.currency_code,
            description_category_id: product.description_category_id,
            discounted_fbo_stocks: product.discounted_fbo_stocks,
            has_discounted_fbo_item: product.has_discounted_fbo_item,
            images: product.images,
            images360: product.images360,
            is_handarchived: product.is_archived,
            is_autoarchived: product.is_autoarchived,
            is_kgt: product.is_kgt,
            is_super: product.is_super,
            min_price: product.min_price,
            name: product.name,
            old_price: product.old_price,
            price: product.price,
            primary_image: product.primary_image,
            sku: product.sku,
            type_id: product.type_id,
            updated_at: new Date(product.updated_at),
            vat: product.vat,
            volume_weight: product.volume_weight,
            quants: (product.listInfo.quants || []).map(quant => 
                manager.create(OzonProductQuantEntity, {
                    quant_code: quant.quant_code,
                    quant_size: quant.quant_size
                })
            ),
            availabilities: (product.availabilities || []).map(availability =>
                manager.create(OzonProductAvailabilityEntity, {
                    availability: availability.availability,
                    sku: availability.sku,
                    source: availability.source,
                    reasons: (availability.reasons || []).map(reason =>
                        manager.create(OzonProductAvailabilityReasonEntity, {
                            text: reason.human_text.text,
                            code: reason.id
                        })
                    )
                })
            ),
            commissions: (product.commissions || []).map(commission =>
                manager.create(OzonProductCommissionEntity, {
                    delivery_amount: commission.delivery_amount ?? 0,
                    percent: commission.percent ?? 0,
                    return_amount: commission.return_amount ?? 0,
                    sale_schema: commission.sale_schema ?? 0,
                    value: commission.value ?? 0
                })
            ),
            errors: (product.errors || []).map(error => 
                manager.create(OzonProductErrorEntity, {
                    attribute_id: error.attribute_id,
                    code: error.code,
                    field: error.field,
                    level: error.level,
                    state: error.state,
                    attribute_name: error.texts.attribute_name,
                    description: error.texts.description,
                    hint_code: error.texts.hint_code,
                    message: error.texts.message,
                    short_description: error.texts.short_description,
                    parameters: (error.texts.params || []).map(parameter =>
                        manager.create(OzonProductErrorParameterEntity, {
                            name: parameter.name,
                            value: parameter.value
                        })
                    )
                })
            ),
            model: manager.create(OzonProductModelEntity, {
                count: product.model_info.count,
                model_id: product.model_info.model_id
            }),
            price_indexes: manager.create(OzonProductPriceIndexEntity, {
                color_index: product.price_indexes.color_index,
                external_index_data: manager.create(OzonProductPriceExternalIndexDataEntity, {
                    minimal_price: product.price_indexes.external_index_data.minimal_price,
                    minimal_price_currency: product.price_indexes.external_index_data.minimal_price_currency,
                    price_index_value: product.price_indexes.external_index_data.price_index_value
                }),
                ozon_index_data: manager.create(OzonProductPriceOzonIndexDataEntity, {
                    minimal_price: product.price_indexes.ozon_index_data.minimal_price,
                    minimal_price_currency: product.price_indexes.ozon_index_data.minimal_price_currency,
                    price_index_value: product.price_indexes.ozon_index_data.price_index_value
                }),
                self_marketplaces_index_data: manager.create(OzonProductPriceMarketplacesIndexDataEntity, {
                    minimal_price: product.price_indexes.self_marketplaces_index_data.minimal_price,
                    minimal_price_currency: product.price_indexes.self_marketplaces_index_data.minimal_price_currency,
                    price_index_value: product.price_indexes.self_marketplaces_index_data.price_index_value
                })
            }),
            promotions: (product.promotions || []).map(promotion =>
                manager.create(OzonProductPromotionEntity, {
                    is_enabled: promotion.is_enabled,
                    type: promotion.type
                })
            ),
            sources: (product.sources || []).map(source =>
                manager.create(OzonProductSourceEntity, {
                    created_at: new Date(source.created_at),
                    quant_code: source.quant_code,
                    shipment_type: source.shipment_type,
                    sku: source.sku,
                    source: source.source
                })
            ),
            statuses: manager.create(OzonProductStatusEntity, {
                is_created: product.statuses.is_created,
                moderate_status: product.statuses.moderate_status,
                status: product.statuses.status,
                status_description: product.statuses.status_description,
                status_failed: product.statuses.status_failed,
                status_name: product.statuses.status_name,
                status_tooltip: product.statuses.status_tooltip,
                status_updated_at: new Date(product.statuses.status_updated_at),
                validation_status: product.statuses.validation_status
            }),
            stocks: manager.create(OzonProductStockEntity, {
                has_stock: product.stocks.has_stock,
                stocks: (product.stocks.stocks || []).map(stock =>
                    manager.create(OzonProductStockDataEntity, {
                        present: stock.present,
                        reserved: stock.reserved,
                        sku: stock.sku,
                        source: stock.source
                    })
                )
            }),
            visibility_details: manager.create(OzonProductVisibilityDetailEntity, {
                has_price: product.visibility_details.has_price,
                has_stock: product.visibility_details.has_stock
            })
        });
    }

    private async cleanupProducts(manager: EntityManager, options: OzonProductsCleanupOptions) {
        const chunkSize = 300;

        if (options.snapshotId && options.productIds && options.productIds.length > 0) {
            const chunks = chunkArray<string>(options.productIds, chunkSize);
            for (const chunk of chunks) {
                await manager.getRepository(OzonProductEntity).delete({
                    datasource_id: options.datasourceId,
                    snapshot_id: Not(options.snapshotId),
                    product_id: In(chunk)
                });
            }
        } else if (options.snapshotId) {
            await manager.getRepository(OzonProductEntity).delete({
                datasource_id: options.datasourceId,
                snapshot_id: options.snapshotId
            });
        }
    }

    async syncProducts(clientId: string, apiKey: string, dataSourceId: string, mode: SyncMode): Promise<SyncResult> {
        const manager = this.dataSource.manager;
        const snapshot = await this.syncSnapshotsService.create(dataSourceId, SyncScope.Products, mode);
        const productsRepository = this.dataSource.getRepository(OzonProductEntity);

        try {
            const newProductsProductsIds = new Set<string>();

            for await (const products of this.streamProducts(clientId, apiKey)) {
                const productsToSave = products.map(product => this.mapToEntity(
                    manager, dataSourceId, snapshot.id, product
                ));
                productsToSave.forEach(product => newProductsProductsIds.add(product.product_id));
                await productsRepository.save(productsToSave, { chunk: 100 });
                this.logger.log(`Чанк из ${productsToSave.length} товаров записан (snapshot ${snapshot.id})`);
            }

            await this.dataSource.transaction(async (manager: EntityManager) => {
                const oldSnapshot = await this.syncSnapshotsService.getActive(dataSourceId, SyncScope.Products);
                
                if (oldSnapshot) {
                    await this.syncSnapshotsService.archive(manager, oldSnapshot.id);
                }

                await this.cleanupProducts(manager, {
                    datasourceId: dataSourceId,
                    snapshotId: snapshot.id,
                    productIds: Array.from(newProductsProductsIds)
                })

                await this.syncSnapshotsService.activate(manager, snapshot.id);
            });

            return {
                snapshotId: snapshot.id,
                success: true
            }
        } catch (error) {
            await this.cleanupProducts(manager, {
                datasourceId: dataSourceId,
                snapshotId: snapshot.id
            })
            await this.syncSnapshotsService.fail(snapshot.id);
            this.logger.error('Ошибка при синхронизации Ozon товаров!', error);
            return {
                snapshotId: snapshot.id,
                success: false,
                error: `Ошибка при синхронизации товаров: ${error?.message || 'Неизвестная ошибка'}`
            }
        }
    }

    async getAllProducts(dataSourceId: string) {
        const snapshotsInProgress = await this.syncSnapshotsService.getLoading(dataSourceId, SyncScope.Products);
        const snapshotsIds = snapshotsInProgress.map(s => s.id);

        return this.dataSource.getRepository(OzonProductEntity).find({
            where: {
                datasource_id: dataSourceId,
                snapshot_id: excludeSnapshots(snapshotsIds)
            },
            relations: {
                quants: true,
                availabilities: {
                    reasons: true,
                },
                commissions: true,
                errors: {
                    parameters: true,
                },
                model: true,
                price_indexes: {
                    external_index_data: true,
                    ozon_index_data: true,
                    self_marketplaces_index_data: true,
                },
                promotions: true,
                sources: true,
                statuses: true,
                stocks: {
                    stocks: true,
                },
                visibility_details: true,
            },
        });
    }
}
