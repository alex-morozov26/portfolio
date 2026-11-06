import { MigrationInterface, QueryRunner } from "typeorm";

export class WbOrders20251213204600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "wb_orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "srid" character varying NOT NULL,
                "date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "last_change_date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "warehouse_name" character varying(50) NOT NULL,
                "warehouse_type" character varying NOT NULL,
                "country_name" character varying(200) NOT NULL,
                "oblast_okrug_name" character varying(200) NOT NULL,
                "region_name" character varying(200) NOT NULL,
                "supplier_article" character varying(75) NOT NULL,
                "nm_id" bigint NOT NULL,
                "barcode" character varying(30) NOT NULL,
                "category" character varying(50) NOT NULL,
                "subject" character varying(50) NOT NULL,
                "brand" character varying(50) NOT NULL,
                "tech_size" character varying(30) NOT NULL,
                "income_id" integer NOT NULL,
                "is_supply" boolean NOT NULL,
                "is_realization" boolean NOT NULL,
                "total_price" numeric NOT NULL,
                "discount_percent" integer NOT NULL,
                "spp" numeric NOT NULL,
                "finished_price" numeric NOT NULL,
                "price_with_disc" numeric NOT NULL,
                "is_cancel" boolean NOT NULL,
                "cancel_date" TIMESTAMP WITH TIME ZONE,
                "sticker" character varying NOT NULL,
                "g_number" character varying(50) NOT NULL,
                CONSTRAINT "PK_3b8e8d3ae41528a3c0a49f6b0b6" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_c24bb734abbea14573fc411af7" ON "wb_orders" ("date")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fac920ad4fbc7256e8b2525e67" ON "wb_orders" ("last_change_date")
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_a7328dafa66b0b5de0b3f38f20" ON "wb_orders" ("srid")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a7328dafa66b0b5de0b3f38f20"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_fac920ad4fbc7256e8b2525e67"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_c24bb734abbea14573fc411af7"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_orders"
        `);
    }

}
