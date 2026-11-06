import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonProducts20251220144800 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "ozon_product_quants" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "quant_code" character varying NOT NULL,
                "quant_size" bigint NOT NULL,
                "productId" uuid,
                CONSTRAINT "PK_8e9d7ac744b03fc168790995c10" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_product_availability_reasons" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "text" text NOT NULL,
                "code" bigint NOT NULL,
                "availabilityId" uuid,
                CONSTRAINT "PK_2fce302f241e3c4c7cb2f247ecd" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_product_availabilities" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "availability" character varying NOT NULL,
                "sku" bigint NOT NULL,
                "source" character varying NOT NULL,
                "productId" uuid,
                CONSTRAINT "PK_dfe0a2b4400b354ad31dadf1cb3" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_product_commissions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "delivery_amount" double precision NOT NULL,
                "percent" double precision NOT NULL,
                "return_amount" double precision NOT NULL,
                "sale_schema" character varying NOT NULL,
                "value" double precision NOT NULL,
                "productId" uuid,
                CONSTRAINT "PK_ef6eeaa94c4e0273317ea694a01" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_product_error_parameters" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "value" text NOT NULL,
                "errorId" uuid,
                CONSTRAINT "PK_fdb5ba19c9054ae0bc2d608016a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_product_errors" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "attribute_id" bigint NOT NULL,
                "code" character varying NOT NULL,
                "field" character varying NOT NULL,
                "level" character varying NOT NULL,
                "state" character varying NOT NULL,
                "attribute_name" character varying NOT NULL,
                "description" text NOT NULL,
                "hint_code" character varying NOT NULL,
                "message" text NOT NULL,
                "short_description" text NOT NULL,
                "productId" uuid,
                CONSTRAINT "PK_c3233d1729f73167cc3f0eae9b0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_product_models" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "count" bigint NOT NULL,
                "model_id" bigint NOT NULL,
                CONSTRAINT "PK_8c71d84b41ff63f35abea004624" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_product_price_indexes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "color_index" character varying NOT NULL,
                CONSTRAINT "PK_4723731409269f0938606224a3e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_product_promotions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "is_enabled" boolean NOT NULL DEFAULT false,
                "type" character varying NOT NULL,
                "productId" uuid,
                CONSTRAINT "PK_b340927f65fdb4cfdff4604e3ca" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_product_sources" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "quant_code" text NOT NULL,
                "shipment_type" character varying NOT NULL,
                "sku" bigint NOT NULL,
                "source" character varying NOT NULL,
                "productId" uuid,
                CONSTRAINT "PK_1b5d33216991aefad433c2c777a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_product_statuses" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "is_created" boolean NOT NULL DEFAULT false,
                "moderate_status" character varying NOT NULL,
                "status" character varying NOT NULL,
                "status_description" text NOT NULL,
                "status_failed" character varying NOT NULL,
                "status_name" character varying NOT NULL,
                "status_tooltip" text NOT NULL,
                "status_updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "validation_status" character varying NOT NULL,
                CONSTRAINT "PK_7bbe4c047cd38c2359c439ced75" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_product_stock_data" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "present" integer NOT NULL,
                "reserved" integer NOT NULL,
                "sku" bigint NOT NULL,
                "source" character varying NOT NULL,
                "productStockId" uuid,
                CONSTRAINT "PK_e2c40acd7277457e9d91f6d4b72" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_product_stocks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "has_stock" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_d90cc757cd67fd2423099b9128d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_product_visibility_details" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "has_price" boolean NOT NULL DEFAULT false,
                "has_stock" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_b8f138477ee89044959fd6e502c" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_products" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "is_archived" boolean NOT NULL DEFAULT false,
                "has_fbo_stocks" boolean NOT NULL DEFAULT false,
                "has_fbs_stocks" boolean NOT NULL DEFAULT false,
                "is_discounted" boolean NOT NULL DEFAULT false,
                "offer_id" character varying NOT NULL,
                "product_id" bigint NOT NULL,
                "barcodes" character varying array NOT NULL,
                "color_image" character varying array NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "currency_code" character varying NOT NULL,
                "description_category_id" bigint NOT NULL,
                "discounted_fbo_stocks" integer NOT NULL,
                "has_discounted_fbo_item" boolean NOT NULL DEFAULT false,
                "images" character varying array NOT NULL,
                "images360" character varying array NOT NULL,
                "is_handarchived" boolean NOT NULL DEFAULT false,
                "is_autoarchived" boolean NOT NULL DEFAULT false,
                "is_kgt" boolean NOT NULL DEFAULT false,
                "is_super" boolean NOT NULL DEFAULT false,
                "min_price" character varying NOT NULL,
                "name" character varying NOT NULL,
                "old_price" character varying NOT NULL,
                "price" character varying NOT NULL,
                "primary_image" character varying array NOT NULL,
                "sku" bigint NOT NULL,
                "type_id" bigint NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "vat" character varying NOT NULL,
                "volume_weight" double precision NOT NULL,
                "modelId" uuid,
                "priceIndexesId" uuid,
                "statusesId" uuid,
                "stocksId" uuid,
                "visibilityDetailsId" uuid,
                CONSTRAINT "UQ_a6af94c02a21c7c758426478c7b" UNIQUE ("product_id"),
                CONSTRAINT "REL_58152a3171fdf829a24bba140b" UNIQUE ("modelId"),
                CONSTRAINT "REL_2a9b2a051e80dab40839ef0fd8" UNIQUE ("priceIndexesId"),
                CONSTRAINT "REL_370f5b735425fee2ff347d311a" UNIQUE ("statusesId"),
                CONSTRAINT "REL_c31e7f3d974ee0f032479325ad" UNIQUE ("stocksId"),
                CONSTRAINT "REL_b21b58f4b732cc9d96ce1cd25e" UNIQUE ("visibilityDetailsId"),
                CONSTRAINT "PK_570af3b618297ff2b041555a138" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_quants"
            ADD CONSTRAINT "FK_bfbaa28bc6db03956e74d100200" FOREIGN KEY ("productId") REFERENCES "ozon_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_availability_reasons"
            ADD CONSTRAINT "FK_058a563973b909729eaa75d9212" FOREIGN KEY ("availabilityId") REFERENCES "ozon_product_availabilities"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_availabilities"
            ADD CONSTRAINT "FK_fc89371f4f712655821e162bc99" FOREIGN KEY ("productId") REFERENCES "ozon_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_commissions"
            ADD CONSTRAINT "FK_fddbd89b7f3cb241788df46eff0" FOREIGN KEY ("productId") REFERENCES "ozon_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_error_parameters"
            ADD CONSTRAINT "FK_1d07a21559fb5e77cc478ef218a" FOREIGN KEY ("errorId") REFERENCES "ozon_product_errors"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_errors"
            ADD CONSTRAINT "FK_fb737709a53662b00b3079b74fc" FOREIGN KEY ("productId") REFERENCES "ozon_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_promotions"
            ADD CONSTRAINT "FK_f1abadae2bc917df5d4aefa5088" FOREIGN KEY ("productId") REFERENCES "ozon_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_sources"
            ADD CONSTRAINT "FK_bd3e4d23a66583b1f2f5999f593" FOREIGN KEY ("productId") REFERENCES "ozon_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_stock_data"
            ADD CONSTRAINT "FK_2dcf4e9c211f9051f807234c26d" FOREIGN KEY ("productStockId") REFERENCES "ozon_product_stocks"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD CONSTRAINT "FK_58152a3171fdf829a24bba140b4" FOREIGN KEY ("modelId") REFERENCES "ozon_product_models"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD CONSTRAINT "FK_2a9b2a051e80dab40839ef0fd83" FOREIGN KEY ("priceIndexesId") REFERENCES "ozon_product_price_indexes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD CONSTRAINT "FK_370f5b735425fee2ff347d311ab" FOREIGN KEY ("statusesId") REFERENCES "ozon_product_statuses"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD CONSTRAINT "FK_c31e7f3d974ee0f032479325ad3" FOREIGN KEY ("stocksId") REFERENCES "ozon_product_stocks"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD CONSTRAINT "FK_b21b58f4b732cc9d96ce1cd25e7" FOREIGN KEY ("visibilityDetailsId") REFERENCES "ozon_product_visibility_details"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP CONSTRAINT "FK_b21b58f4b732cc9d96ce1cd25e7"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP CONSTRAINT "FK_c31e7f3d974ee0f032479325ad3"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP CONSTRAINT "FK_370f5b735425fee2ff347d311ab"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP CONSTRAINT "FK_2a9b2a051e80dab40839ef0fd83"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP CONSTRAINT "FK_58152a3171fdf829a24bba140b4"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_stock_data" DROP CONSTRAINT "FK_2dcf4e9c211f9051f807234c26d"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_sources" DROP CONSTRAINT "FK_bd3e4d23a66583b1f2f5999f593"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_promotions" DROP CONSTRAINT "FK_f1abadae2bc917df5d4aefa5088"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_errors" DROP CONSTRAINT "FK_fb737709a53662b00b3079b74fc"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_error_parameters" DROP CONSTRAINT "FK_1d07a21559fb5e77cc478ef218a"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_commissions" DROP CONSTRAINT "FK_fddbd89b7f3cb241788df46eff0"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_availabilities" DROP CONSTRAINT "FK_fc89371f4f712655821e162bc99"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_availability_reasons" DROP CONSTRAINT "FK_058a563973b909729eaa75d9212"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_quants" DROP CONSTRAINT "FK_bfbaa28bc6db03956e74d100200"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_products"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_visibility_details"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_stocks"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_stock_data"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_statuses"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_sources"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_promotions"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_price_indexes"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_models"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_errors"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_error_parameters"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_commissions"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_availabilities"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_availability_reasons"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_quants"
        `);
    }

}
