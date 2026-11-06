import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonAdsStats20251225193700 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "ozon_ads_stats" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "campaign_id" bigint NOT NULL,
                "title" character varying,
                "total_search_query" character varying,
                "total_views" character varying,
                "total_clicks" character varying,
                "total_ctr" character varying,
                "total_to_cart" character varying,
                "total_avg_bid" character varying,
                "total_money_spent" character varying,
                "total_orders" character varying,
                "total_orders_money" character varying,
                "total_models" character varying,
                "total_models_money" character varying,
                "total_ddr" character varying,
                CONSTRAINT "UQ_df2f0b023ac639c0e078e51a076" UNIQUE ("campaign_id"),
                CONSTRAINT "PK_c44060afec632b9e342c00214a2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_ads_stat_rows" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "sku" bigint,
                "title" character varying,
                "price" character varying,
                "search_query" character varying,
                "views" character varying,
                "clicks" character varying,
                "ctr" character varying,
                "to_cart" character varying,
                "avg_bid" character varying,
                "money_spent" character varying,
                "orders" character varying,
                "orders_money" character varying,
                "models" character varying,
                "models_money" character varying,
                "ddr" character varying,
                "created_at" date,
                "statId" uuid,
                CONSTRAINT "PK_d41f836327eb90182d0f5b258eb" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_ads_stat_rows"
            ADD CONSTRAINT "FK_ae09aa64cf5b5a38ea2bd611bf2" FOREIGN KEY ("statId") REFERENCES "ozon_ads_stats"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_ads_stat_rows" DROP CONSTRAINT "FK_ae09aa64cf5b5a38ea2bd611bf2"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_ads_stat_rows"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_ads_stats"
        `);
    }

}
