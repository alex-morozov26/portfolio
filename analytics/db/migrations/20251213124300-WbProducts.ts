import { MigrationInterface, QueryRunner } from "typeorm";

export class WbProducts20251213124300 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "wb_product_photos" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "big" character varying,
                "c246x328" character varying,
                "c516x688" character varying,
                "square" character varying,
                "tm" character varying,
                "productId" uuid,
                CONSTRAINT "PK_0048afbf4760a2d8070bc67bf3b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_product_wholesales" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "enabled" boolean NOT NULL DEFAULT false,
                "quantum" bigint,
                "productId" uuid,
                CONSTRAINT "PK_ce897db4369bfd154e7ba03822d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_product_dimensions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "length" integer,
                "width" integer,
                "height" integer,
                "weightBrutto" numeric(8, 3),
                "isValid" boolean NOT NULL DEFAULT true,
                "productId" uuid,
                CONSTRAINT "PK_5625f2cec1fd46a7e13b995982c" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_product_characteristics" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying,
                "value" jsonb,
                "productId" uuid,
                CONSTRAINT "PK_ac83398b9e7ee11b6f60af021f6" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_product_sizes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "chrtID" integer,
                "techSize" character varying,
                "wbSize" character varying,
                "skus" text array,
                "productId" uuid,
                CONSTRAINT "PK_0a8b597ac806182cd4c59e06b00" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_product_tags" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "wbTagId" integer NOT NULL,
                "name" character varying NOT NULL,
                "color" character varying NOT NULL,
                "productId" uuid,
                CONSTRAINT "PK_f122a72500fcfecef25056cf835" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_products" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "nm_id" bigint NOT NULL,
                "imt_id" bigint,
                "nm_uuid" uuid,
                "subject_id" integer,
                "subject_name" character varying,
                "vendor_code" character varying,
                "brand" character varying,
                "title" character varying,
                "description" text,
                "need_kiz" boolean NOT NULL DEFAULT false,
                "wb_created_at" TIMESTAMP,
                "wb_updated_at" TIMESTAMP,
                "video" character varying,
                "synced_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_084bcf465bd097f1e7f7f97fc3c" UNIQUE ("nm_id"),
                CONSTRAINT "PK_13aa5cd0055f4017322039dab5c" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_product_photos"
            ADD CONSTRAINT "FK_1bdd8fc8736cca01f22743afae3" FOREIGN KEY ("productId") REFERENCES "wb_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_product_wholesales"
            ADD CONSTRAINT "FK_cd9d8866152624be8869916dec8" FOREIGN KEY ("productId") REFERENCES "wb_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_product_dimensions"
            ADD CONSTRAINT "FK_1cbf4f716d32925c4a1301c858c" FOREIGN KEY ("productId") REFERENCES "wb_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_product_characteristics"
            ADD CONSTRAINT "FK_3f1e61ad37111a968652fb4b4bc" FOREIGN KEY ("productId") REFERENCES "wb_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_product_sizes"
            ADD CONSTRAINT "FK_c654a74d4f87cbfef06a21000c6" FOREIGN KEY ("productId") REFERENCES "wb_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_product_tags"
            ADD CONSTRAINT "FK_f58f2add5fa10f0b0037bb7b73a" FOREIGN KEY ("productId") REFERENCES "wb_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_product_tags" DROP CONSTRAINT "FK_f58f2add5fa10f0b0037bb7b73a"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_product_sizes" DROP CONSTRAINT "FK_c654a74d4f87cbfef06a21000c6"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_product_characteristics" DROP CONSTRAINT "FK_3f1e61ad37111a968652fb4b4bc"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_product_dimensions" DROP CONSTRAINT "FK_1cbf4f716d32925c4a1301c858c"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_product_wholesales" DROP CONSTRAINT "FK_cd9d8866152624be8869916dec8"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_product_photos" DROP CONSTRAINT "FK_1bdd8fc8736cca01f22743afae3"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_products"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_product_tags"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_product_sizes"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_product_characteristics"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_product_dimensions"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_product_wholesales"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_product_photos"
        `);
    }
}
