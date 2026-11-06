import { MigrationInterface, QueryRunner } from "typeorm";

export class WbStocks20251214160100 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "wb_stock_avg_orders_month" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "start" date NOT NULL,
                "end" date NOT NULL,
                "value" double precision NOT NULL,
                "metricsId" uuid,
                CONSTRAINT "PK_4aa21c8064269023948c02c2b83" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_stock_current_prices" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "min_price" bigint NOT NULL,
                "max_price" bigint NOT NULL,
                CONSTRAINT "PK_7e46b3c205356e9f33155690f3d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_stock_metrics" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "orders_count" bigint NOT NULL,
                "orders_sum" bigint NOT NULL,
                "avg_orders" double precision NOT NULL,
                "buyout_count" bigint NOT NULL,
                "buyout_sum" bigint NOT NULL,
                "buyout_percent" integer NOT NULL,
                "stock_count" bigint NOT NULL,
                "stock_sum" bigint NOT NULL,
                "to_client_count" bigint NOT NULL,
                "from_client_count" bigint NOT NULL,
                "lost_orders_count" double precision NOT NULL,
                "lost_orders_sum" double precision NOT NULL,
                "lost_buyouts_count" double precision NOT NULL,
                "lost_buyouts_sum" double precision NOT NULL,
                "availability" character varying NOT NULL,
                "stockId" uuid,
                "currentPriceId" uuid,
                CONSTRAINT "REL_956debfc3473cb7f29d47e6f8e" UNIQUE ("stockId"),
                CONSTRAINT "REL_52f03e06f61776f2032c1c8e0a" UNIQUE ("currentPriceId"),
                CONSTRAINT "PK_35e631795d87992cd70a89b0f48" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_stocks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "nm_id" bigint NOT NULL,
                "is_deleted" boolean NOT NULL,
                "subject_name" character varying NOT NULL,
                "name" character varying NOT NULL,
                "vendor_code" character varying NOT NULL,
                "brand_name" character varying NOT NULL,
                "main_photo" character varying NOT NULL,
                "has_sizes" boolean NOT NULL,
                CONSTRAINT "UQ_34b1420f291f040887386be6185" UNIQUE ("nm_id"),
                CONSTRAINT "PK_405bea6f6fcd8f3f13cc3373c7e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_avg_orders_month"
            ADD CONSTRAINT "FK_f4f960c7499d2ec1bc66626c81e" FOREIGN KEY ("metricsId") REFERENCES "wb_stock_metrics"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_metrics"
            ADD CONSTRAINT "FK_956debfc3473cb7f29d47e6f8e2" FOREIGN KEY ("stockId") REFERENCES "wb_stocks"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_metrics"
            ADD CONSTRAINT "FK_52f03e06f61776f2032c1c8e0a2" FOREIGN KEY ("currentPriceId") REFERENCES "wb_stock_current_prices"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_stock_metrics" DROP CONSTRAINT "FK_52f03e06f61776f2032c1c8e0a2"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_metrics" DROP CONSTRAINT "FK_956debfc3473cb7f29d47e6f8e2"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_avg_orders_month" DROP CONSTRAINT "FK_f4f960c7499d2ec1bc66626c81e"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_stocks"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_stock_metrics"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_stock_current_prices"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_stock_avg_orders_month"
        `);
    }

}
