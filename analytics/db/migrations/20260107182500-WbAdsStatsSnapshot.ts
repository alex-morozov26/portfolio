import { MigrationInterface, QueryRunner } from "typeorm";

export class WbAdsStatsSnapshot20260107182500 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_ads_stats"
            ADD "snapshot_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_ads_stats" DROP COLUMN "snapshot_id"
        `);
    }

}
