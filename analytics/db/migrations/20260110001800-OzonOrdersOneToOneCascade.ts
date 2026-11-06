import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonOrdersOneToOneCascade20260110001800 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
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
            ALTER TABLE "ozon_orders" DROP CONSTRAINT "REL_4e320c723aa3dd075b2639caf6"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders" DROP COLUMN "legalInfoId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders" DROP CONSTRAINT "REL_3880ff7ebc212e5cd3e63fd9d9"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders" DROP COLUMN "analyticsDataId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders" DROP CONSTRAINT "REL_67f4eb016bd79815fd085e5348"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders" DROP COLUMN "financialDataId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_legal_info"
            ADD "orderId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_legal_info"
            ADD CONSTRAINT "UQ_3a250e8bcf06170bcb9929fc160" UNIQUE ("orderId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_analytics_data"
            ADD "orderId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_analytics_data"
            ADD CONSTRAINT "UQ_aa8230aa0faa6ee2682c4d93d37" UNIQUE ("orderId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_financial_data"
            ADD "orderId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_financial_data"
            ADD CONSTRAINT "UQ_741636f8a9e5e67302934025d33" UNIQUE ("orderId")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_ozon_order_products_order_id" ON "ozon_order_products" ("orderId")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_ozon_order_additional_data_order_id" ON "ozon_order_additional_data" ("orderId")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_ozon_financial_data_products_financial_id" ON "ozon_order_financial_data_products" ("financialDataId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_legal_info"
            ADD CONSTRAINT "FK_3a250e8bcf06170bcb9929fc160" FOREIGN KEY ("orderId") REFERENCES "ozon_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_analytics_data"
            ADD CONSTRAINT "FK_aa8230aa0faa6ee2682c4d93d37" FOREIGN KEY ("orderId") REFERENCES "ozon_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_financial_data"
            ADD CONSTRAINT "FK_741636f8a9e5e67302934025d33" FOREIGN KEY ("orderId") REFERENCES "ozon_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_order_financial_data" DROP CONSTRAINT "FK_741636f8a9e5e67302934025d33"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_analytics_data" DROP CONSTRAINT "FK_aa8230aa0faa6ee2682c4d93d37"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_legal_info" DROP CONSTRAINT "FK_3a250e8bcf06170bcb9929fc160"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_ozon_financial_data_products_financial_id"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_ozon_order_additional_data_order_id"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_ozon_order_products_order_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_financial_data" DROP CONSTRAINT "UQ_741636f8a9e5e67302934025d33"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_financial_data" DROP COLUMN "orderId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_analytics_data" DROP CONSTRAINT "UQ_aa8230aa0faa6ee2682c4d93d37"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_analytics_data" DROP COLUMN "orderId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_legal_info" DROP CONSTRAINT "UQ_3a250e8bcf06170bcb9929fc160"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_order_legal_info" DROP COLUMN "orderId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders"
            ADD "financialDataId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders"
            ADD CONSTRAINT "REL_67f4eb016bd79815fd085e5348" UNIQUE ("financialDataId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders"
            ADD "analyticsDataId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders"
            ADD CONSTRAINT "REL_3880ff7ebc212e5cd3e63fd9d9" UNIQUE ("analyticsDataId")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders"
            ADD "legalInfoId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders"
            ADD CONSTRAINT "REL_4e320c723aa3dd075b2639caf6" UNIQUE ("legalInfoId")
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

}
