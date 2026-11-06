import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonAdsStatsDataSource20251229193600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_ads_stats"
            ADD "datasource_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_ads_stats" DROP COLUMN "datasource_id"
        `);
    }

}
