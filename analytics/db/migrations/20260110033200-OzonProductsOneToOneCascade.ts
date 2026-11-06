import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonProductsOneToOneCascade20260110033200 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP CONSTRAINT "FK_58152a3171fdf829a24bba140b4"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP CONSTRAINT "FK_2a9b2a051e80dab40839ef0fd83"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP CONSTRAINT "FK_370f5b735425fee2ff347d311ab"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP CONSTRAINT "FK_c31e7f3d974ee0f032479325ad3"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP CONSTRAINT "FK_b21b58f4b732cc9d96ce1cd25e7"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_product_wholesales" DROP CONSTRAINT "FK_cd9d8866152624be8869916dec8"
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_product_price_external_index_data" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "minimal_price" character varying NOT NULL,
                "minimal_price_currency" character varying NOT NULL,
                "price_index_value" double precision NOT NULL,
                "indexId" uuid,
                CONSTRAINT "REL_3044972124c966be05d4223510" UNIQUE ("indexId"),
                CONSTRAINT "PK_7a27a22aaca3c24d6e31fa91082" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_product_price_ozon_index_data" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "minimal_price" character varying NOT NULL,
                "minimal_price_currency" character varying NOT NULL,
                "price_index_value" double precision NOT NULL,
                "indexId" uuid,
                CONSTRAINT "REL_f9347e971a8fd35b34a697a64a" UNIQUE ("indexId"),
                CONSTRAINT "PK_4193aa745cdabb13e421565079c" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_product_price_marketplaces_index_data" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "minimal_price" character varying NOT NULL,
                "minimal_price_currency" character varying NOT NULL,
                "price_index_value" double precision NOT NULL,
                "indexId" uuid,
                CONSTRAINT "REL_f7aa2115b3b0aae8d79d2c02c5" UNIQUE ("indexId"),
                CONSTRAINT "PK_caf4ab88964fe67ce0249ae27d4" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP CONSTRAINT "REL_b21b58f4b732cc9d96ce1cd25e"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP COLUMN "visibilityDetailsId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP CONSTRAINT "REL_c31e7f3d974ee0f032479325ad"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP COLUMN "stocksId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP CONSTRAINT "REL_58152a3171fdf829a24bba140b"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP COLUMN "modelId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP CONSTRAINT "REL_370f5b735425fee2ff347d311a"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP COLUMN "statusesId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP CONSTRAINT "REL_2a9b2a051e80dab40839ef0fd8"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP COLUMN "priceIndexesId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_models"
            ADD "productId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_models"
            ADD CONSTRAINT "UQ_94afef9db398701fc4f494e1060" UNIQUE ("productId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_price_indexes"
            ADD "productId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_price_indexes"
            ADD CONSTRAINT "UQ_cef4237d9ff8f2bc210f5562bfb" UNIQUE ("productId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_statuses"
            ADD "productId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_statuses"
            ADD CONSTRAINT "UQ_cf61788c92b096c41d9a85ca239" UNIQUE ("productId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_stocks"
            ADD "productId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_stocks"
            ADD CONSTRAINT "UQ_3fa0438e7cede594999f896960a" UNIQUE ("productId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_visibility_details"
            ADD "productId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_visibility_details"
            ADD CONSTRAINT "UQ_20f08a224b8d6b067e5f56fcc30" UNIQUE ("productId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_models"
            ADD CONSTRAINT "FK_94afef9db398701fc4f494e1060" FOREIGN KEY ("productId") REFERENCES "ozon_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_price_external_index_data"
            ADD CONSTRAINT "FK_3044972124c966be05d4223510a" FOREIGN KEY ("indexId") REFERENCES "ozon_product_price_indexes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_price_ozon_index_data"
            ADD CONSTRAINT "FK_f9347e971a8fd35b34a697a64a7" FOREIGN KEY ("indexId") REFERENCES "ozon_product_price_indexes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_price_marketplaces_index_data"
            ADD CONSTRAINT "FK_f7aa2115b3b0aae8d79d2c02c56" FOREIGN KEY ("indexId") REFERENCES "ozon_product_price_indexes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_price_indexes"
            ADD CONSTRAINT "FK_cef4237d9ff8f2bc210f5562bfb" FOREIGN KEY ("productId") REFERENCES "ozon_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_statuses"
            ADD CONSTRAINT "FK_cf61788c92b096c41d9a85ca239" FOREIGN KEY ("productId") REFERENCES "ozon_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_stocks"
            ADD CONSTRAINT "FK_3fa0438e7cede594999f896960a" FOREIGN KEY ("productId") REFERENCES "ozon_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_visibility_details"
            ADD CONSTRAINT "FK_20f08a224b8d6b067e5f56fcc30" FOREIGN KEY ("productId") REFERENCES "ozon_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_product_wholesales"
            ADD CONSTRAINT "FK_2ac77d3efae10c4729681206105" FOREIGN KEY ("productId") REFERENCES "wb_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_product_wholesales" DROP CONSTRAINT "FK_2ac77d3efae10c4729681206105"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_visibility_details" DROP CONSTRAINT "FK_20f08a224b8d6b067e5f56fcc30"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_stocks" DROP CONSTRAINT "FK_3fa0438e7cede594999f896960a"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_statuses" DROP CONSTRAINT "FK_cf61788c92b096c41d9a85ca239"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_price_indexes" DROP CONSTRAINT "FK_cef4237d9ff8f2bc210f5562bfb"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_price_marketplaces_index_data" DROP CONSTRAINT "FK_f7aa2115b3b0aae8d79d2c02c56"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_price_ozon_index_data" DROP CONSTRAINT "FK_f9347e971a8fd35b34a697a64a7"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_price_external_index_data" DROP CONSTRAINT "FK_3044972124c966be05d4223510a"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_models" DROP CONSTRAINT "FK_94afef9db398701fc4f494e1060"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_visibility_details" DROP CONSTRAINT "UQ_20f08a224b8d6b067e5f56fcc30"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_visibility_details" DROP COLUMN "productId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_stocks" DROP CONSTRAINT "UQ_3fa0438e7cede594999f896960a"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_stocks" DROP COLUMN "productId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_statuses" DROP CONSTRAINT "UQ_cf61788c92b096c41d9a85ca239"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_statuses" DROP COLUMN "productId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_price_indexes" DROP CONSTRAINT "UQ_cef4237d9ff8f2bc210f5562bfb"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_price_indexes" DROP COLUMN "productId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_models" DROP CONSTRAINT "UQ_94afef9db398701fc4f494e1060"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_product_models" DROP COLUMN "productId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD "priceIndexesId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD CONSTRAINT "REL_2a9b2a051e80dab40839ef0fd8" UNIQUE ("priceIndexesId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD "statusesId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD CONSTRAINT "REL_370f5b735425fee2ff347d311a" UNIQUE ("statusesId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD "modelId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD CONSTRAINT "REL_58152a3171fdf829a24bba140b" UNIQUE ("modelId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD "stocksId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD CONSTRAINT "REL_c31e7f3d974ee0f032479325ad" UNIQUE ("stocksId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD "visibilityDetailsId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD CONSTRAINT "REL_b21b58f4b732cc9d96ce1cd25e" UNIQUE ("visibilityDetailsId")
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_price_marketplaces_index_data"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_price_ozon_index_data"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_product_price_external_index_data"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_product_wholesales"
            ADD CONSTRAINT "FK_cd9d8866152624be8869916dec8" FOREIGN KEY ("productId") REFERENCES "wb_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD CONSTRAINT "FK_b21b58f4b732cc9d96ce1cd25e7" FOREIGN KEY ("visibilityDetailsId") REFERENCES "ozon_product_visibility_details"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD CONSTRAINT "FK_c31e7f3d974ee0f032479325ad3" FOREIGN KEY ("stocksId") REFERENCES "ozon_product_stocks"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD CONSTRAINT "FK_370f5b735425fee2ff347d311ab" FOREIGN KEY ("statusesId") REFERENCES "ozon_product_statuses"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD CONSTRAINT "FK_2a9b2a051e80dab40839ef0fd83" FOREIGN KEY ("priceIndexesId") REFERENCES "ozon_product_price_indexes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD CONSTRAINT "FK_58152a3171fdf829a24bba140b4" FOREIGN KEY ("modelId") REFERENCES "ozon_product_models"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
