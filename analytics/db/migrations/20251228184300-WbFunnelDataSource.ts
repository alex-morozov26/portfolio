import { MigrationInterface, QueryRunner } from "typeorm";

export class WbFunnelDataSource20251228184300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_funnel"
            ADD "datasource_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_funnel" DROP COLUMN "datasource_id"
        `);
    }

}
