import { MigrationInterface, QueryRunner } from "typeorm";

export class WbStocksDataSource20251228193700 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_stocks"
            ADD "datasource_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_stocks" DROP COLUMN "datasource_id"
        `);
    }

}
