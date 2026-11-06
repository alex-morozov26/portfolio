import { MigrationInterface, QueryRunner } from "typeorm";

export class IndexesToDeleteWithDsAndSnapshot20260110162000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_cad1a966b532b2fd47376e02a3"
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_wb_prices_ds_nm_snapshot" ON "wb_prices" ("datasource_id", "nm_id", "snapshot_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_wb_orders_ds_srid_snapshot" ON "wb_orders" ("datasource_id", "srid", "snapshot_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_wb_funnel_ds_nm_snapshot" ON "wb_funnel" ("datasource_id", "nm_id", "snapshot_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_wb_stocks_ds_nm_snapshot" ON "wb_stocks" ("datasource_id", "nm_id", "snapshot_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_wb_ads_campaigns_ds_advert_snapshot" ON "wb_ads_campaigns" ("datasource_id", "advert_id", "snapshot_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_wb_ads_stats_ds_advert_snapshot" ON "wb_ads_stats" ("datasource_id", "advert_id", "snapshot_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_ozon_products_ds_product_snapshot" ON "ozon_products" ("datasource_id", "product_id", "snapshot_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_ozon_prices_ds_product_snapshot" ON "ozon_prices" ("datasource_id", "product_id", "snapshot_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_ozon_orders_ds_posting_snapshot" ON "ozon_orders" ("datasource_id", "posting_number", "snapshot_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_ozon_funnel_ds_sku_snapshot" ON "ozon_funnel" ("datasource_id", "sku", "snapshot_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_ozon_stocks_ds_identity_snapshot" ON "ozon_stocks" ("datasource_id", "identity", "snapshot_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_ozon_warehouses_ds_warehouse_snapshot" ON "ozon_warehouses" ("datasource_id", "warehouse_id", "snapshot_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_ozon_ads_campaigns_ds_campaign_snapshot" ON "ozon_ads_campaigns" ("datasource_id", "campaign_id", "snapshot_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_ozon_ads_stats_ds_campaign_snapshot" ON "ozon_ads_stats" ("datasource_id", "campaign_id", "snapshot_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_wb_products_ds_nm_snapshot" ON "wb_products" ("datasource_id", "nm_id", "snapshot_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."idx_wb_products_ds_nm_snapshot"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_ozon_ads_stats_ds_campaign_snapshot"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_ozon_ads_campaigns_ds_campaign_snapshot"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_ozon_warehouses_ds_warehouse_snapshot"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_ozon_stocks_ds_identity_snapshot"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_ozon_funnel_ds_sku_snapshot"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_ozon_orders_ds_posting_snapshot"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_ozon_prices_ds_product_snapshot"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_ozon_products_ds_product_snapshot"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_wb_ads_stats_ds_advert_snapshot"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_wb_ads_campaigns_ds_advert_snapshot"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_wb_stocks_ds_nm_snapshot"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_wb_funnel_ds_nm_snapshot"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_wb_orders_ds_srid_snapshot"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_wb_prices_ds_nm_snapshot"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_cad1a966b532b2fd47376e02a3" ON "ozon_stocks" ("datasource_id", "identity")
        `);
    }

}
