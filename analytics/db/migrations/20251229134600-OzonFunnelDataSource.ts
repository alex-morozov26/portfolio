import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonFunnelDataSource20251229134600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_funnel"
            ADD "datasource_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_funnel" DROP COLUMN "datasource_id"
        `);
    }

}
