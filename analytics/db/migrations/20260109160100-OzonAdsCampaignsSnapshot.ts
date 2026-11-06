import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonAdsCampaignsSnapshot20260109160100 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_ads_campaigns"
            ADD "snapshot_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_ads_campaigns" DROP CONSTRAINT "UQ_fe0f71d92ca0acd5fc264e2962a"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_ads_campaigns"
            ADD CONSTRAINT "UQ_fe0f71d92ca0acd5fc264e2962a" UNIQUE ("campaign_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_ads_campaigns" DROP COLUMN "snapshot_id"
        `);
    }

}
