import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonPrices20251221084100 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "ozon_price_commissions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "fbo_deliv_to_customer_amount" double precision NOT NULL,
                "fbo_direct_flow_trans_max_amount" double precision NOT NULL,
                "fbo_direct_flow_trans_min_amount" double precision NOT NULL,
                "fbo_return_flow_amount" double precision NOT NULL,
                "fbs_deliv_to_customer_amount" double precision NOT NULL,
                "fbs_direct_flow_trans_max_amount" double precision NOT NULL,
                "fbs_direct_flow_trans_min_amount" double precision NOT NULL,
                "fbs_first_mile_max_amount" double precision NOT NULL,
                "fbs_first_mile_min_amount" double precision NOT NULL,
                "fbs_return_flow_amount" double precision NOT NULL,
                "sales_percent_fbo" double precision NOT NULL,
                "sales_percent_fbp" double precision NOT NULL,
                "sales_percent_fbs" double precision NOT NULL,
                "sales_percent_rfbs" double precision NOT NULL,
                CONSTRAINT "PK_8a7b0e83f3d851fd790dfdf5908" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_price_marketing_action_data" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "value" integer NOT NULL,
                "date_from" TIMESTAMP WITH TIME ZONE NOT NULL,
                "date_to" TIMESTAMP WITH TIME ZONE NOT NULL,
                "priceMarketingId" uuid,
                CONSTRAINT "PK_41569f9d1ba7082eae8033ac459" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_price_marketing_actions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "current_period_from" TIMESTAMP WITH TIME ZONE NOT NULL,
                "current_period_to" TIMESTAMP WITH TIME ZONE NOT NULL,
                "ozon_actions_exist" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_2066c54c86d2fdcb518c24ee0ef" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_price_data" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "auto_action_enabled" boolean NOT NULL DEFAULT false,
                "auto_add_to_ozon_actions_list_enabled" boolean NOT NULL DEFAULT false,
                "currency_code" character varying(3) NOT NULL,
                "marketing_seller_price" double precision NOT NULL,
                "min_price" double precision NOT NULL,
                "net_price" double precision NOT NULL,
                "old_price" double precision NOT NULL,
                "price" double precision NOT NULL,
                "retail_price" double precision NOT NULL,
                "vat" double precision NOT NULL,
                CONSTRAINT "PK_372716e42c5a36b8f4493652b2b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_price_indexes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "color_index" character varying NOT NULL,
                CONSTRAINT "PK_71c0b56b1be0ba791852deab6c0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_prices" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "acquiring" double precision NOT NULL,
                "offer_id" character varying NOT NULL,
                "product_id" bigint NOT NULL,
                "volume_weight" double precision NOT NULL,
                "commissionsId" uuid,
                "marketingActionsId" uuid,
                "priceId" uuid,
                "priceIndexesId" uuid,
                CONSTRAINT "UQ_f5f2cfa8fa87d3287781588356c" UNIQUE ("product_id"),
                CONSTRAINT "REL_b5e0ffb779071c5201b2b73454" UNIQUE ("commissionsId"),
                CONSTRAINT "REL_b104fc311af3112ca4130dfec1" UNIQUE ("marketingActionsId"),
                CONSTRAINT "REL_891602d1cc5347468888a3171d" UNIQUE ("priceId"),
                CONSTRAINT "REL_65e0d1f825c2e76766bb510eb3" UNIQUE ("priceIndexesId"),
                CONSTRAINT "PK_41a8679b3bf71d9e82d7b498a89" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_price_marketing_action_data"
            ADD CONSTRAINT "FK_9897e8e322ba75e6dcb1fa964e4" FOREIGN KEY ("priceMarketingId") REFERENCES "ozon_price_marketing_actions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
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

    public async down(queryRunner: QueryRunner): Promise<void> {
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
            ALTER TABLE "ozon_price_marketing_action_data" DROP CONSTRAINT "FK_9897e8e322ba75e6dcb1fa964e4"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_prices"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_price_indexes"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_price_data"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_price_marketing_actions"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_price_marketing_action_data"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_price_commissions"
        `);
    }

}
