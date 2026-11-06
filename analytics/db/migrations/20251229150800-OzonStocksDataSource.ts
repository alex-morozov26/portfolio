import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonStocksDataSource20251229150800 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_stocks"
            ADD "datasource_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_stocks" DROP COLUMN "datasource_id"
        `);
    }

}
