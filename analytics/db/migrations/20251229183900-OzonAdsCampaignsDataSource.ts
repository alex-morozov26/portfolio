import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonAdsCampaignsDataSource20251229183900 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_ads_campaigns"
            ADD "datasource_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_ads_campaigns" DROP COLUMN "datasource_id"
        `);
    }

}
