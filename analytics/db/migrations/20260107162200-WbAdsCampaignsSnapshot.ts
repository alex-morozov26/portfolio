import { MigrationInterface, QueryRunner } from "typeorm";

export class WbAdsCampaignsSnapshot20260107162200 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_ads_campaigns"
            ADD "snapshot_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_ads_campaigns"
            ALTER COLUMN "create_time"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_ads_campaigns"
            ALTER COLUMN "name"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_ads_campaigns"
            ALTER COLUMN "advert_id"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_ads_campaigns" DROP CONSTRAINT "UQ_2f5a17515535b557a7e38567700"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_ads_campaigns"
            ADD CONSTRAINT "UQ_2f5a17515535b557a7e38567700" UNIQUE ("advert_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_ads_campaigns"
            ALTER COLUMN "advert_id" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_ads_campaigns"
            ALTER COLUMN "name" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_ads_campaigns"
            ALTER COLUMN "create_time" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_ads_campaigns" DROP COLUMN "snapshot_id"
        `);
    }

}
