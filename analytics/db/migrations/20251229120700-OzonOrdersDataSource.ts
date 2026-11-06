import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonOrdersDataSource20251229120700 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_orders"
            ADD "datasource_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_orders" DROP COLUMN "datasource_id"
        `);
    }

}
