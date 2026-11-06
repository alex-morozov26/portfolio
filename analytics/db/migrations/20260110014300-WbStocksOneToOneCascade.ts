import { MigrationInterface, QueryRunner } from "typeorm";

export class WbStocksOneToOneCascade20260110014300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_stock_metrics" DROP CONSTRAINT "FK_52f03e06f61776f2032c1c8e0a2"
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_stock_sale_rates" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "days" integer NOT NULL,
                "hours" integer NOT NULL,
                "metricsId" uuid,
                CONSTRAINT "REL_de0067d8893c4e51c3f3612dbf" UNIQUE ("metricsId"),
                CONSTRAINT "PK_a6ea4f0fde0ab0d722172d3eecd" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_stock_avg_stock_turnovers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "days" integer NOT NULL,
                "hours" integer NOT NULL,
                "metricsId" uuid,
                CONSTRAINT "REL_4d9849bbb5ad30ae6a94bdb751" UNIQUE ("metricsId"),
                CONSTRAINT "PK_89a909d50b108f856dec8789fa9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_stock_office_missing_times" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "days" integer NOT NULL,
                "hours" integer NOT NULL,
                "metricsId" uuid,
                CONSTRAINT "REL_9670bacb1c280c0ecbef723711" UNIQUE ("metricsId"),
                CONSTRAINT "PK_f42c0ca31973d199dd77cf9bcac" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_metrics" DROP CONSTRAINT "REL_52f03e06f61776f2032c1c8e0a"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_metrics" DROP COLUMN "currentPriceId"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_current_prices"
            ADD "metricsId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_current_prices"
            ADD CONSTRAINT "UQ_434486ab54b5547b1205716e1c1" UNIQUE ("metricsId")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_wb_stock_avg_orders_month_metric_id" ON "wb_stock_avg_orders_month" ("metricsId")
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_current_prices"
            ADD CONSTRAINT "FK_434486ab54b5547b1205716e1c1" FOREIGN KEY ("metricsId") REFERENCES "wb_stock_metrics"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_sale_rates"
            ADD CONSTRAINT "FK_de0067d8893c4e51c3f3612dbf9" FOREIGN KEY ("metricsId") REFERENCES "wb_stock_metrics"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_avg_stock_turnovers"
            ADD CONSTRAINT "FK_4d9849bbb5ad30ae6a94bdb7512" FOREIGN KEY ("metricsId") REFERENCES "wb_stock_metrics"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_office_missing_times"
            ADD CONSTRAINT "FK_9670bacb1c280c0ecbef7237117" FOREIGN KEY ("metricsId") REFERENCES "wb_stock_metrics"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_stock_office_missing_times" DROP CONSTRAINT "FK_9670bacb1c280c0ecbef7237117"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_avg_stock_turnovers" DROP CONSTRAINT "FK_4d9849bbb5ad30ae6a94bdb7512"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_sale_rates" DROP CONSTRAINT "FK_de0067d8893c4e51c3f3612dbf9"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_current_prices" DROP CONSTRAINT "FK_434486ab54b5547b1205716e1c1"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_wb_stock_avg_orders_month_metric_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_current_prices" DROP CONSTRAINT "UQ_434486ab54b5547b1205716e1c1"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_current_prices" DROP COLUMN "metricsId"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_metrics"
            ADD "currentPriceId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_metrics"
            ADD CONSTRAINT "REL_52f03e06f61776f2032c1c8e0a" UNIQUE ("currentPriceId")
        `);
        await queryRunner.query(`
            DROP TABLE "wb_stock_office_missing_times"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_stock_avg_stock_turnovers"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_stock_sale_rates"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stock_metrics"
            ADD CONSTRAINT "FK_52f03e06f61776f2032c1c8e0a2" FOREIGN KEY ("currentPriceId") REFERENCES "wb_stock_current_prices"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
