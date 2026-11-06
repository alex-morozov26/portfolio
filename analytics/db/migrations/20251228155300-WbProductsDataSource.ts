import { MigrationInterface, QueryRunner } from "typeorm";

export class WbProductsDataSource20251228155300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_products"
            ADD "datasource_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_products" DROP COLUMN "datasource_id"
        `);
    }

}
