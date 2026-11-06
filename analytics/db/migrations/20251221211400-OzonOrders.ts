import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonOrders20251221211400 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "ozon_order_products" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "digital_codes" character varying array NOT NULL,
                "name" character varying NOT NULL,
                "offer_id" character varying NOT NULL,
                "currency_code" character varying(3) NOT NULL,
                "price" character varying NOT NULL,
                "is_marketplace_buyout" boolean NOT NULL DEFAULT false,
                "quantity" bigint NOT NULL,
                "sku" bigint NOT NULL,
                "orderId" uuid,
                CONSTRAINT "PK_080a274f08731d94f366e06c958" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_order_legal_info" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "company_name" character varying NOT NULL,
                "inn" character varying NOT NULL,
                "kpp" character varying NOT NULL,
                CONSTRAINT "PK_0f149b01b8c6d178d6d091608a1" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_order_analytics_data" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "city" character varying NOT NULL,
                "delivery_type" character varying NOT NULL,
                "is_legal" boolean NOT NULL DEFAULT false,
                "is_premium" boolean NOT NULL DEFAULT false,
                "payment_type_group_name" character varying(50) NOT NULL,
                "warehouse_id" bigint NOT NULL,
                "warehouse_name" character varying NOT NULL,
                "client_delivery_date_begin" TIMESTAMP WITH TIME ZONE,
                "client_delivery_date_end" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_0f33460b98306b1195ad6123626" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_order_additional_data" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "key" character varying NOT NULL,
                "value" character varying NOT NULL,
                "orderId" uuid,
                CONSTRAINT "PK_42cb87495acb931c331d1acf46a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_order_financial_data_products" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "actions" character varying array NOT NULL,
                "currency_code" character varying(3) NOT NULL,
                "commission_amount" double precision NOT NULL,
                "commission_percent" bigint NOT NULL,
                "commissions_currency_code" character varying(3),
                "old_price" double precision NOT NULL,
                "payout" double precision NOT NULL,
                "price" double precision NOT NULL,
                "product_id" bigint NOT NULL,
                "quantity" bigint,
                "total_discount_percent" double precision NOT NULL,
                "total_discount_value" double precision NOT NULL,
                "financialDataId" uuid,
                CONSTRAINT "PK_e614f497cef990d0d6bf76f23de" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_order_financial_data" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "cluster_from" character varying NOT NULL,
                "cluster_to" character varying NOT NULL,
                CONSTRAINT "PK_d2ad987d261fd4d793578af39b8" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "cancel_reason_id" bigint,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "in_process_at" TIMESTAMP WITH TIME ZONE,
                "order_id" bigint NOT NULL,
                "order_number" character varying NOT NULL,
                "posting_number" character varying NOT NULL,
                "status" character varying NOT NULL,
                "substatus" character varying,
                "legalInfoId" uuid,
                "analyticsDataId" uuid,
                "financialDataId" uuid,
                CONSTRAINT "UQ_2a8a0e61736f9f9920113b66082" UNIQUE ("posting_number"),
                CONSTRAINT "REL_4e320c723aa3dd075b2639caf6" UNIQUE ("legalInfoId"),
                CONSTRAINT "REL_3880ff7ebc212e5cd3e63fd9d9" UNIQUE ("analyticsDataId"),
                CONSTRAINT "REL_67f4eb016bd79815fd085e5348" UNIQUE ("financialDataId"),
                CONSTRAINT "PK_0884a49d01097ccd02ab792823a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_products"
            ADD CONSTRAINT "FK_7c00b4d0a5915b049d8c1253ce7" FOREIGN KEY ("orderId") REFERENCES "ozon_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_additional_data"
            ADD CONSTRAINT "FK_79c5094c9037c88a680091d015f" FOREIGN KEY ("orderId") REFERENCES "ozon_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_financial_data_products"
            ADD CONSTRAINT "FK_3fd839a3ed47dba5b7278b16c6f" FOREIGN KEY ("financialDataId") REFERENCES "ozon_order_financial_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders"
            ADD CONSTRAINT "FK_4e320c723aa3dd075b2639caf65" FOREIGN KEY ("legalInfoId") REFERENCES "ozon_order_legal_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders"
            ADD CONSTRAINT "FK_3880ff7ebc212e5cd3e63fd9d99" FOREIGN KEY ("analyticsDataId") REFERENCES "ozon_order_analytics_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders"
            ADD CONSTRAINT "FK_67f4eb016bd79815fd085e53485" FOREIGN KEY ("financialDataId") REFERENCES "ozon_order_financial_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_orders" DROP CONSTRAINT "FK_67f4eb016bd79815fd085e53485"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders" DROP CONSTRAINT "FK_3880ff7ebc212e5cd3e63fd9d99"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders" DROP CONSTRAINT "FK_4e320c723aa3dd075b2639caf65"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_financial_data_products" DROP CONSTRAINT "FK_3fd839a3ed47dba5b7278b16c6f"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_additional_data" DROP CONSTRAINT "FK_79c5094c9037c88a680091d015f"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_products" DROP CONSTRAINT "FK_7c00b4d0a5915b049d8c1253ce7"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_orders"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_order_financial_data"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_order_financial_data_products"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_order_additional_data"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_order_analytics_data"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_order_legal_info"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_order_products"
        `);
    }

}
