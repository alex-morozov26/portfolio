import { MigrationInterface, QueryRunner } from "typeorm";

export class WbAdsCampaignsDataSource20251228202200 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_ads_campaigns"
            ADD "datasource_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_ads_campaigns" DROP COLUMN "datasource_id"
        `);
    }

}
