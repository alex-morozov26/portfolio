import { MigrationInterface, QueryRunner } from "typeorm";

export class WbAdsStatsDataSource20251228211700 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_ads_stats"
            ADD "datasource_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_ads_stats" DROP COLUMN "datasource_id"
        `);
    }

}
