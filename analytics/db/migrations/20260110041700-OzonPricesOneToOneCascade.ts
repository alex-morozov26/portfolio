import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonPricesOneToOneCascade20260110041700 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_prices" DROP CONSTRAINT "FK_65e0d1f825c2e76766bb510eb38"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices" DROP CONSTRAINT "FK_891602d1cc5347468888a3171d9"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices" DROP CONSTRAINT "FK_b104fc311af3112ca4130dfec1a"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices" DROP CONSTRAINT "FK_b5e0ffb779071c5201b2b73454c"
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_price_external_index_data" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "min_price" double precision NOT NULL,
                "min_price_currency" character varying(3) NOT NULL,
                "price_index_value" double precision NOT NULL,
                "indexId" uuid,
                CONSTRAINT "REL_2fb6f333dc4e1422c490e7dbb3" UNIQUE ("indexId"),
                CONSTRAINT "PK_78ab04140dcbf7c5f7366fb1a23" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_price_ozon_index_data" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "min_price" double precision NOT NULL,
                "min_price_currency" character varying(3) NOT NULL,
                "price_index_value" double precision NOT NULL,
                "indexId" uuid,
                CONSTRAINT "REL_72bf9ac75f36c6cb1b249799b8" UNIQUE ("indexId"),
                CONSTRAINT "PK_d3768e6eab57c945d00337c18bc" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_price_marketplaces_index_data" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "min_price" double precision NOT NULL,
                "min_price_currency" character varying(3) NOT NULL,
                "price_index_value" double precision NOT NULL,
                "indexId" uuid,
                CONSTRAINT "REL_40c4c7f47e6f6a1b36957c2da2" UNIQUE ("indexId"),
                CONSTRAINT "PK_84fb6e852d981aaeea48c860e77" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices" DROP CONSTRAINT "REL_65e0d1f825c2e76766bb510eb3"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices" DROP COLUMN "priceIndexesId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices" DROP CONSTRAINT "REL_b104fc311af3112ca4130dfec1"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices" DROP COLUMN "marketingActionsId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices" DROP CONSTRAINT "REL_891602d1cc5347468888a3171d"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices" DROP COLUMN "priceId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices" DROP CONSTRAINT "REL_b5e0ffb779071c5201b2b73454"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices" DROP COLUMN "commissionsId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_commissions"
            ADD "priceId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_commissions"
            ADD CONSTRAINT "UQ_71dacf17a3225a2a36044cd5703" UNIQUE ("priceId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_marketing_actions"
            ADD "priceId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_marketing_actions"
            ADD CONSTRAINT "UQ_2aafb590b7c90dd30d8f2168605" UNIQUE ("priceId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_data"
            ADD "priceRelId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_data"
            ADD CONSTRAINT "UQ_f322f9419a3a2b33c7d7b37e4fd" UNIQUE ("priceRelId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_indexes"
            ADD "priceId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_indexes"
            ADD CONSTRAINT "UQ_04d3a34b4e1875faea7c5224023" UNIQUE ("priceId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_commissions"
            ADD CONSTRAINT "FK_71dacf17a3225a2a36044cd5703" FOREIGN KEY ("priceId") REFERENCES "ozon_prices"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_marketing_actions"
            ADD CONSTRAINT "FK_2aafb590b7c90dd30d8f2168605" FOREIGN KEY ("priceId") REFERENCES "ozon_prices"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_data"
            ADD CONSTRAINT "FK_f322f9419a3a2b33c7d7b37e4fd" FOREIGN KEY ("priceRelId") REFERENCES "ozon_prices"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_external_index_data"
            ADD CONSTRAINT "FK_2fb6f333dc4e1422c490e7dbb30" FOREIGN KEY ("indexId") REFERENCES "ozon_price_indexes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_ozon_index_data"
            ADD CONSTRAINT "FK_72bf9ac75f36c6cb1b249799b8c" FOREIGN KEY ("indexId") REFERENCES "ozon_price_indexes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_marketplaces_index_data"
            ADD CONSTRAINT "FK_40c4c7f47e6f6a1b36957c2da21" FOREIGN KEY ("indexId") REFERENCES "ozon_price_indexes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_indexes"
            ADD CONSTRAINT "FK_04d3a34b4e1875faea7c5224023" FOREIGN KEY ("priceId") REFERENCES "ozon_prices"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_price_indexes" DROP CONSTRAINT "FK_04d3a34b4e1875faea7c5224023"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_marketplaces_index_data" DROP CONSTRAINT "FK_40c4c7f47e6f6a1b36957c2da21"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_ozon_index_data" DROP CONSTRAINT "FK_72bf9ac75f36c6cb1b249799b8c"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_external_index_data" DROP CONSTRAINT "FK_2fb6f333dc4e1422c490e7dbb30"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_data" DROP CONSTRAINT "FK_f322f9419a3a2b33c7d7b37e4fd"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_marketing_actions" DROP CONSTRAINT "FK_2aafb590b7c90dd30d8f2168605"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_commissions" DROP CONSTRAINT "FK_71dacf17a3225a2a36044cd5703"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_indexes" DROP CONSTRAINT "UQ_04d3a34b4e1875faea7c5224023"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_indexes" DROP COLUMN "priceId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_data" DROP CONSTRAINT "UQ_f322f9419a3a2b33c7d7b37e4fd"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_data" DROP COLUMN "priceRelId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_marketing_actions" DROP CONSTRAINT "UQ_2aafb590b7c90dd30d8f2168605"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_marketing_actions" DROP COLUMN "priceId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_commissions" DROP CONSTRAINT "UQ_71dacf17a3225a2a36044cd5703"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_commissions" DROP COLUMN "priceId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices"
            ADD "commissionsId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices"
            ADD CONSTRAINT "REL_b5e0ffb779071c5201b2b73454" UNIQUE ("commissionsId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices"
            ADD "priceId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices"
            ADD CONSTRAINT "REL_891602d1cc5347468888a3171d" UNIQUE ("priceId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices"
            ADD "marketingActionsId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices"
            ADD CONSTRAINT "REL_b104fc311af3112ca4130dfec1" UNIQUE ("marketingActionsId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices"
            ADD "priceIndexesId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices"
            ADD CONSTRAINT "REL_65e0d1f825c2e76766bb510eb3" UNIQUE ("priceIndexesId")
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_price_marketplaces_index_data"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_price_ozon_index_data"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_price_external_index_data"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices"
            ADD CONSTRAINT "FK_b5e0ffb779071c5201b2b73454c" FOREIGN KEY ("commissionsId") REFERENCES "ozon_price_commissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices"
            ADD CONSTRAINT "FK_b104fc311af3112ca4130dfec1a" FOREIGN KEY ("marketingActionsId") REFERENCES "ozon_price_marketing_actions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices"
            ADD CONSTRAINT "FK_891602d1cc5347468888a3171d9" FOREIGN KEY ("priceId") REFERENCES "ozon_price_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices"
            ADD CONSTRAINT "FK_65e0d1f825c2e76766bb510eb38" FOREIGN KEY ("priceIndexesId") REFERENCES "ozon_price_indexes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
