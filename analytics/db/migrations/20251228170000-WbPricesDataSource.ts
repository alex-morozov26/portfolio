import { MigrationInterface, QueryRunner } from "typeorm";

export class WbPricesDataSource20251228170000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_prices"
            ADD "datasource_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_prices" DROP COLUMN "datasource_id"
        `);
    }

}
