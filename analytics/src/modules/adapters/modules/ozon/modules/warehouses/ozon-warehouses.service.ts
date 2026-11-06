import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import axios from 'axios';
import { OzonWarehouseEntity } from './entities/ozon-warehouse.entity';
import { SyncSnapshotsService } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.service';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { SyncResult } from 'src/modules/sync/modules/sync-snapshots/models/sync-result.interface';
import { chunkArray } from 'src/utils/chunk-array';
import { sleep } from 'src/utils/sleep';
import { OzonWarehousesCleanupOptions } from './models/warehouses-cleanup-options.interface';
import { excludeSnapshots } from 'src/utils/exclude-snapshots';

@Injectable()
export class OzonWarehousesService {
    private readonly logger = new Logger(OzonWarehousesService.name);
    private readonly apiUrl = 'https://api-seller.ozon.ru/v1/cluster/list';

    constructor(
        private readonly dataSource: DataSource,
        private readonly syncSnapshotsService: SyncSnapshotsService
    ) { }

    private async *streamWarehouses(clientId: string, apiKey: string) {
        const chunkSize = 150;
        const options = {
            headers: {
                'Client-Id': clientId,
                'Api-Key': apiKey,
                'Content-Type': 'application/json',
            }
        }

        const payload = {
            cluster_ids: [],
            cluster_type: "CLUSTER_TYPE_OZON"
        }

        const { data } = await axios.post(this.apiUrl, payload, options);
        const clusters = data.clusters || [];

        const warehouses = clusters.flatMap(cluster =>
            (cluster.logistic_clusters || []).flatMap(logistic_cluster =>
                (logistic_cluster.warehouses || []).map(warehouse => ({
                    cluster_id: cluster.id,
                    macrolocal_cluster_id: cluster.macrolocal_cluster_id,
                    cluster_name: cluster.name,
                    cluster_type: cluster.type,
                    warehouse_id: warehouse.warehouse_id,
                    warehouse_type: warehouse.type,
                    warehouse_name: warehouse.name
                }))
            )
        );

        const chunks = chunkArray(warehouses, chunkSize);

        for (const chunk of chunks) {
            yield chunk;
            await sleep(500);
        }
    }

    private mapToEntity(manager: EntityManager, dataSourceId: string, snapshotId: string, warehouse: any): OzonWarehouseEntity {
        return manager.create(OzonWarehouseEntity, {
            datasource_id: dataSourceId,
            snapshot_id: snapshotId,
            cluster_id: warehouse.cluster_id,
            macrolocal_cluster_id: warehouse.macrolocal_cluster_id,
            cluster_name: warehouse.cluster_name,
            cluster_type: warehouse.cluster_type,
            warehouse_id: warehouse.warehouse_id,
            warehouse_type: warehouse.warehouse_type,
            warehouse_name: warehouse.warehouse_name
        });
    }

    private async cleanupWarehouses(manager: EntityManager, options: OzonWarehousesCleanupOptions) {
        const chunkSize = 300;

        if (options.snapshotId && options.warehouseIds && options.warehouseIds.length > 0) {
            const chunks = chunkArray<string>(options.warehouseIds, chunkSize);
            for (const chunk of chunks) {
                await manager.getRepository(OzonWarehouseEntity).delete({
                    datasource_id: options.datasourceId,
                    snapshot_id: Not(options.snapshotId),
                    warehouse_id: In(chunk)
                });
            }
        } else if (options.snapshotId) {
            await manager.getRepository(OzonWarehouseEntity).delete({
                datasource_id: options.datasourceId,
                snapshot_id: options.snapshotId
            });
        }
    }

    async syncWarehouses(clientId: string, apiKey: string, dataSourceId: string, mode: SyncMode): Promise<SyncResult> {
        const manager = this.dataSource.manager;
        const snapshot = await this.syncSnapshotsService.create(dataSourceId, SyncScope.Warehouses, mode);
        const warehousesRepository = this.dataSource.getRepository(OzonWarehouseEntity);

        try {
            const newWarehousesWarehousesIds = new Set<string>();

            for await (const warehouses of this.streamWarehouses(clientId, apiKey)) {
                const warehousesToSave = warehouses.map(warehouse => this.mapToEntity(
                    manager, dataSourceId, snapshot.id, warehouse
                ))
                warehousesToSave.forEach(warehouse => newWarehousesWarehousesIds.add(warehouse.warehouse_id));
                await warehousesRepository.save(warehousesToSave, { chunk: 100 })
                this.logger.log(`Чанк из ${warehousesToSave.length} складов записан (snapshot ${snapshot.id})`);
            }

            await this.dataSource.transaction(async (manager: EntityManager) => {
                const oldSnapshot = await this.syncSnapshotsService.getActive(dataSourceId, SyncScope.Warehouses);
                
                if (oldSnapshot) {
                    await this.syncSnapshotsService.archive(manager, oldSnapshot.id);
                }

                await this.cleanupWarehouses(manager, {
                    datasourceId: dataSourceId,
                    snapshotId: snapshot.id,
                    warehouseIds: Array.from(newWarehousesWarehousesIds)
                })

                await this.syncSnapshotsService.activate(manager, snapshot.id);
            });

            return {
                snapshotId: snapshot.id,
                success: true
            }
        } catch (error) {
            await this.cleanupWarehouses(manager, {
                datasourceId: dataSourceId,
                snapshotId: snapshot.id
            })
            await this.syncSnapshotsService.fail(snapshot.id);
            this.logger.error('Ошибка при синхронизации Ozon складов!', error);
            return {
                snapshotId: snapshot.id,
                success: false,
                error: `Ошибка при синхронизации складов: ${error?.message || 'Неизвестная ошибка'}`
            }
        }
    }

    async getAllWarehouses(dataSourceId: string) {
        const snapshotsInProgress = await this.syncSnapshotsService.getLoading(dataSourceId, SyncScope.Warehouses);
        const snapshotsIds = snapshotsInProgress.map(s => s.id);

        return this.dataSource.getRepository(OzonWarehouseEntity).find({
            where: {
                datasource_id: dataSourceId,
                snapshot_id: excludeSnapshots(snapshotsIds)
            }
        })
    }
}
