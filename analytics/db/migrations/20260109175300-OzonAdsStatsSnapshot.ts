import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonAdsStatsSnapshot20260109175300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_ads_stats"
            ADD "snapshot_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_ads_stats" DROP CONSTRAINT "UQ_df2f0b023ac639c0e078e51a076"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_ads_stats"
            ADD CONSTRAINT "UQ_df2f0b023ac639c0e078e51a076" UNIQUE ("campaign_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_ads_stats" DROP COLUMN "snapshot_id"
        `);
    }

}
