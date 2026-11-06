import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import axios from 'axios';
import { OzonOrderEntity } from './entities/ozon-order.entity';
import { OzonOrderProductEntity } from './entities/ozon-order-product.entity';
import { OzonOrderLegalInfoEntity } from './entities/ozon-order-legal-info.entity';
import { OzonOrderAnalyticsDataEntity } from './entities/ozon-order-analytics-data.entity';
import { OzonOrderAdditionalDataEntity } from './entities/ozon-order-additional-data.entity';
import { OzonOrderFinancialDataEntity } from './entities/ozon-order-financial-data.entity';
import { OzonOrderFinancialDataProductEntity } from './entities/ozon-order-financial-data-product.entity';
import { OrdersDayInterval } from './models/orders-day-inteval.interface';
import { SyncSnapshotsService } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.service';
import { chunkArray } from 'src/utils/chunk-array';
import { SyncScope } from 'src/modules/sync/modules/sync-logs/models/sync-scope.enum';
import { SyncMode } from 'src/modules/adapters/models/sync-mode.enum';
import { SyncResult } from 'src/modules/sync/modules/sync-snapshots/models/sync-result.interface';
import { OzonOrdersCleanupOptions } from './models/orders-cleanup-options.interface';
import { excludeSnapshots } from 'src/utils/exclude-snapshots';

@Injectable()
export class OzonOrdersService {
    private readonly logger = new Logger(OzonOrdersService.name);
    private readonly apiUrl = 'https://api-seller.ozon.ru/v2/posting/fbo/list';

    constructor(
        private readonly dataSource: DataSource,
        private readonly syncSnapshotsService: SyncSnapshotsService
    ) { }

    private async *streamOrders(clientId: string, apiKey: string) {
        const dateRange = this.getDateRange();
        const limit = 1000;

        const options = {
            headers: {
                'Client-Id': clientId,
                'Api-Key': apiKey,
                'Content-Type': 'application/json',
            }
        }

        for (const date of dateRange) {
            let offset = 0;
            const filter = {
                since: date.since,
                to: date.to
            }


            do {
                const payload = {
                    filter: filter,
                    dir: "ASC",
                    with: {
                        analytics_data: true,
                        financial_data: true,
                        legal_info: true
                    },
                    limit: limit,
                    offset: offset
                }

                const { data } = await axios.post(this.apiUrl, payload, options);
                const orders = data.result ?? [];
                if (!orders.length) break;

                const interval = `${date.since} - ${date.to}`;
                yield [orders, interval];
    
                offset += limit;
                if (orders.length !== limit) break
            } while (true);
        }
    }

    private getDateRange(): OrdersDayInterval[] {
        const today = new Date();

        const result = Array.from({ length: 90 }, (_, i) => {
            const to = new Date(today);
            to.setDate(today.getDate() - i);
            const since = new Date(to);
            since.setDate(to.getDate() - 1);

            return { 
                since: since.toISOString(),
                to: to.toISOString()
            };
        });

        return result;
    }

    private mapToEntity(manager: EntityManager, dataSourceId: string, snapshotId: string, order: any): OzonOrderEntity {
        return manager.create(OzonOrderEntity, {
            datasource_id: dataSourceId,
            snapshot_id: snapshotId,
            cancel_reason_id: order.cancel_reason_id ?? null,
            created_at: new Date(order.created_at),
            in_process_at: order.in_process_at ? new Date(order.in_process_at) : null,
            order_id: order.order_id,
            order_number: order.order_number,
            posting_number: order.posting_number,
            status: order.status,
            substatus: order.substatus ?? null,
            products: (order.products || []).map(product =>
                manager.create(OzonOrderProductEntity, {
                    digital_codes: product.digital_codes,
                    name: product.name,
                    offer_id: product.offer_id,
                    currency_code: product.currency_code,
                    price: product.price,
                    is_marketplace_buyout: product.is_marketplace_buyout,
                    quantity: product.quantity,
                    sku: product.sku
                })
            ),
            legal_info: manager.create(OzonOrderLegalInfoEntity, {
                company_name: order.legal_info.company_name,
                inn: order.legal_info.inn,
                kpp: order.legal_info.kpp
            }),
            analytics_data: manager.create(OzonOrderAnalyticsDataEntity, {
                city: order.analytics_data.city,
                delivery_type: order.analytics_data.delivery_type,
                is_legal: order.analytics_data.is_legal,
                is_premium: order.analytics_data.is_premium,
                payment_type_group_name: order.analytics_data.payment_type_group_name,
                warehouse_id: order.analytics_data.warehouse_id,
                warehouse_name: order.analytics_data.warehouse_name,
                client_delivery_date_begin: order.analytics_data.client_delivery_date_begin
                    ? new Date(order.analytics_data.client_delivery_date_begin)
                    : null,
                client_delivery_date_end: order.analytics_data.client_delivery_date_end
                    ? new Date(order.analytics_data.client_delivery_date_end)
                    : null
            }),
            additional_data: (order.additional_data || []).map(additionalData =>
                manager.create(OzonOrderAdditionalDataEntity, {
                    key: additionalData.key,
                    value: additionalData.value
                })
            ),
            financial_data: manager.create(OzonOrderFinancialDataEntity, {
                cluster_from: order.financial_data.cluster_from,
                cluster_to: order.financial_data.cluster_to,
                products: (order.financial_data.products || []).map(product =>
                    manager.create(OzonOrderFinancialDataProductEntity, {
                        actions: product.actions,
                        currency_code: product.currency_code,
                        commission_amount: product.commission_amount,
                        commission_percent: product.commission_percent,
                        commissions_currency_code: product.commissions_currency_code ?? null,
                        old_price: product.old_price,
                        payout: product.payout,
                        price: product.price,
                        product_id: product.product_id,
                        quantity: product.quantity ?? null,
                        total_discount_percent: product.total_discount_percent,
                        total_discount_value: product.total_discount_value,
                    })
                )
            })
        });
    }

    private async cleanupOrders(manager: EntityManager, options: OzonOrdersCleanupOptions) {
        const chunkSize = 300;

        if (options.snapshotId && options.postingNumbers && options.postingNumbers.length > 0) {
            const chunks = chunkArray<string>(options.postingNumbers, chunkSize);
            for (const chunk of chunks) {
                await manager.getRepository(OzonOrderEntity).delete({
                    datasource_id: options.datasourceId,
                    snapshot_id: Not(options.snapshotId),
                    posting_number: In(chunk)
                });
            }
        } else if (options.snapshotId) {
            await manager.getRepository(OzonOrderEntity).delete({
                datasource_id: options.datasourceId,
                snapshot_id: options.snapshotId
            });
        }
    }

    async syncOrders(clientId: string, apiKey: string, dataSourceId: string, mode: SyncMode): Promise<SyncResult> {
        const manager = this.dataSource.manager;
        const snapshot = await this.syncSnapshotsService.create(dataSourceId, SyncScope.Orders, mode);
        const ordersRepository = this.dataSource.getRepository(OzonOrderEntity);
        
        try {
            const newOrdersPostingNumbers = new Set<string>();

            for await (const [orders, inteval] of this.streamOrders(clientId, apiKey)) {
                const ordersToSave = orders.map(order => this.mapToEntity(
                    manager, dataSourceId, snapshot.id, order
                ));
                ordersToSave.forEach(order => newOrdersPostingNumbers.add(order.posting_number));
                await ordersRepository.save(ordersToSave, { chunk: 100 });
                this.logger.log(`Чанк из ${ordersToSave.length} заказов за ${inteval} записан (snapshot ${snapshot.id})`);
            }

            await this.dataSource.transaction(async (manager: EntityManager) => {
                const oldSnapshot = await this.syncSnapshotsService.getActive(dataSourceId, SyncScope.Orders);
                
                if (oldSnapshot) {
                    await this.syncSnapshotsService.archive(manager, oldSnapshot.id);
                }

                await this.cleanupOrders(manager, {
                    datasourceId: dataSourceId,
                    snapshotId: snapshot.id,
                    postingNumbers: Array.from(newOrdersPostingNumbers)
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
            this.logger.error('Ошибка при синхронизации Ozon заказов!', error);
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
        const snapshotsCriteria = excludeSnapshots(snapshotsIds)

        const repository = this.dataSource.getRepository(OzonOrderEntity);
        const limit = 100;
        const offset = 0;

        const [orders, total] = await Promise.all([
            repository.find({
                where: {
                    datasource_id: dataSourceId,
                    snapshot_id: snapshotsCriteria
                },
                relations: {
                    products: true,
                    legal_info: true,
                    analytics_data: true,
                    additional_data: true,
                    financial_data: { products: true }
                },
                order: { created_at: 'DESC' },
                take: limit,
                skip: offset
            }),
            repository.count({
                where: {
                    datasource_id: dataSourceId,
                    snapshot_id: snapshotsCriteria
                }
            })
        ]);

        return { 
            results: orders,
            count: total,
            offset: offset,
            limit: limit
        };
    }
}
