import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonPricesDataSource20251229105100 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_prices"
            ADD "datasource_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_prices" DROP COLUMN "datasource_id"
        `);
    }

}
