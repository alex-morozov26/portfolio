import { MigrationInterface, QueryRunner } from "typeorm";

export class WbOrdersDataSource20251228175600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_orders"
            ADD "datasource_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_orders" DROP COLUMN "datasource_id"
        `);
    }

}
