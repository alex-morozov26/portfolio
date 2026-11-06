import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonStocks20251222221800 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "ozon_stocks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "ads" double precision NOT NULL,
                "ads_cluster" double precision NOT NULL,
                "available_stock_count" integer NOT NULL,
                "cluster_id" bigint NOT NULL,
                "cluster_name" character varying NOT NULL,
                "days_without_sales" integer NOT NULL,
                "days_without_sales_cluster" integer NOT NULL,
                "excess_stock_count" integer NOT NULL,
                "expiring_stock_count" integer NOT NULL,
                "idc" double precision NOT NULL,
                "idc_cluster" double precision NOT NULL,
                "item_tags" character varying array NOT NULL,
                "name" character varying NOT NULL,
                "offer_id" character varying NOT NULL,
                "other_stock_count" integer NOT NULL,
                "requested_stock_count" integer NOT NULL,
                "return_from_customer_stock_count" integer NOT NULL,
                "return_to_seller_stock_count" integer NOT NULL,
                "sku" bigint NOT NULL,
                "stock_defect_stock_count" integer NOT NULL,
                "transit_defect_stock_count" integer NOT NULL,
                "transit_stock_count" integer NOT NULL,
                "turnover_grade" character varying(25) NOT NULL,
                "turnover_grade_cluster" character varying(25) NOT NULL,
                "valid_stock_count" integer NOT NULL,
                "waiting_docs_stock_count" integer NOT NULL,
                "warehouse_id" bigint NOT NULL,
                "warehouse_name" character varying NOT NULL,
                CONSTRAINT "PK_97af90e6c9a3caa8bdfdb962a1e" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "ozon_stocks"
        `);
    }

}
