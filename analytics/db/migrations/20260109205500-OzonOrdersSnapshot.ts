import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonOrdersSnapshot20260109205500 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_orders"
            ADD "snapshot_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders" DROP CONSTRAINT "UQ_2a8a0e61736f9f9920113b66082"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_orders"
            ADD CONSTRAINT "UQ_2a8a0e61736f9f9920113b66082" UNIQUE ("posting_number")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_orders" DROP COLUMN "snapshot_id"
        `);
    }

}
