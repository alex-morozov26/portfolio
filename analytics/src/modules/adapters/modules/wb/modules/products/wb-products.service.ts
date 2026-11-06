import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import axios from 'axios';
import { WbProductEntity } from './entities/wb-product.entity';
import { WbProductPhotoEntity } from './entities/wb-product-photo.entity';
import { WbProductDimensionEntity } from './entities/wb-product-dimension.entity';
import { WbProductCharacteristicEntity } from './entities/wb-product-characteristic.entity';
import { WbProductSizeEntity } from './entities/wb-product-size.entity';
import { WbProductTagEntity } from './entities/wb-product-tag.entity';
import { WbProductWholesaleEntity } from './entities/wb-product-wholesale.entity';
import { SyncSnapshotsService } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.service';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { SyncResult } from 'src/modules/sync/modules/sync-snapshots/models/sync-result.interface';
import { WbProductsCleanupOptions } from './models/products-cleanup-options.interface';
import { chunkArray } from 'src/utils/chunk-array';
import { excludeSnapshots } from 'src/utils/exclude-snapshots';

@Injectable()
export class WbProductsService {
    private readonly logger = new Logger(WbProductsService.name);
    private readonly apiUrl = 'https://content-api.wildberries.ru/content/v2/get/cards/list';

    constructor(
        private readonly dataSource: DataSource,
        private readonly syncSnapshotsService: SyncSnapshotsService
    ) { }

    private async *streamProducts(apiToken: string) {
        let cursor: any = null;
        const limit = 100;

        do {
            const payload = {
                settings: {
                    sort: { ascending: false },
                    filter: {
                        textSearch: '',
                        allowedCategoriesOnly: true,
                        tagIDs: [],
                        objectIDs: [],
                        brands: [],
                        imtID: 0,
                        withPhoto: -1,
                    },
                    cursor: {
                        limit: limit,
                        ...cursor,
                    },
                },
            };

            const { data } = await axios.post(this.apiUrl, payload, {
                headers: { Authorization: apiToken, 'Content-Type': 'application/json' },
            });

            const products = data.cards ?? [];
            if (!products.length) break;

            yield products;

            cursor = data.cursor;
            if (products.length < limit) break;
        } while (true);
    }

    private mapToEntity(manager: EntityManager, dataSourceId: string, snapshotId: string, product: any): WbProductEntity {
        return manager.create(WbProductEntity, {
            datasource_id: dataSourceId,
            snapshot_id: snapshotId,
            nm_id: product.nmID,
            imt_id: product.imtID,
            nm_uuid: product.nmUUID,
            subject_id: product.subjectID,
            subject_name: product.subjectName,
            vendor_code: product.vendorCode,
            brand: product.brand,
            title: product.title,
            description: product.description,
            need_kiz: product.needKiz,
            wb_created_at: product.createdAt ? new Date(product.createdAt) : null,
            wb_updated_at: product.updatedAt ? new Date(product.updatedAt) : null,
            video: product.video,
            photos: (product.photos || []).map(photo =>
                manager.create(WbProductPhotoEntity, {
                    big: photo.big,
                    c246x328: photo.c246x328,
                    c516x688: photo.c516x688,
                    square: photo.square,
                    tm: photo.tm
                })
            ),
            dimensions: product.dimensions ? [
                manager.create(WbProductDimensionEntity, {
                    length: product.dimensions.length,
                    width: product.dimensions.width,
                    height: product.dimensions.height,
                    weightBrutto: product.dimensions.weightBrutto,
                    isValid: product.dimensions.isValid ?? true
                })
            ] : [],
            wholesale: product.wholesale ? [
                manager.create(WbProductWholesaleEntity, {
                    enabled: product.wholesale.enabled,
                    quantum: product.wholesale.quantum
                })
            ] : [],
            characteristics: (product.characteristics || []).map(characteristic =>
                manager.create(WbProductCharacteristicEntity, {
                    name: characteristic.name,
                    value: characteristic.value
                })
            ),
            sizes: (product.sizes || []).map(size =>
                manager.create(WbProductSizeEntity, {
                    chrtID: size.chrtID,
                    techSize: size.techSize,
                    wbSize: size.wbSize,
                    skus: size.skus
                })
            ),
            tags: (product.tags || []).map(tag =>
                manager.create(WbProductTagEntity, {
                    wbTagId: tag.id,
                    name: tag.name,
                    color: tag.color
                })
            )
        });
    }

    private async cleanupProducts(manager: EntityManager, options: WbProductsCleanupOptions) {
        const chunkSize = 300;

        if (options.snapshotId && options.nmIds && options.nmIds.length > 0) {
            const chunks = chunkArray<string>(options.nmIds, chunkSize);
            for (const chunk of chunks) {
                await manager.getRepository(WbProductEntity).delete({
                    datasource_id: options.datasourceId,
                    snapshot_id: Not(options.snapshotId),
                    nm_id: In(chunk)
                });
            }
        } else if (options.snapshotId) {
            await manager.getRepository(WbProductEntity).delete({
                datasource_id: options.datasourceId,
                snapshot_id: options.snapshotId
            });
        }
    }

    async syncProducts(apiToken: string, dataSourceId: string, mode: SyncMode): Promise<SyncResult> {
        const manager = this.dataSource.manager;
        const snapshot = await this.syncSnapshotsService.create(dataSourceId, SyncScope.Products, mode);
        const productsRepository = this.dataSource.getRepository(WbProductEntity);
        
        try {
            const newProductNmIds = new Set<string>();
            
            for await (const products of this.streamProducts(apiToken)) {
                const productsToSave = products.map(product => this.mapToEntity(
                    manager, dataSourceId, snapshot.id, product
                ));
                productsToSave.forEach(product => newProductNmIds.add(product.nm_id));
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
                    nmIds: Array.from(newProductNmIds)
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
            this.logger.error('Ошибка при синхронизации WB товаров!', error);
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

        return this.dataSource.getRepository(WbProductEntity).find({
            where: {
                datasource_id: dataSourceId,
                snapshot_id: excludeSnapshots(snapshotsIds)
            },
            relations: {
                characteristics: true,
                dimensions: true,
                photos: true,
                sizes: true,
                tags: true,
                wholesale: true
            }
        })
    }
}
