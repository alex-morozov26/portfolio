import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonAdsStatsRowCreatedNotNull20260111145300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_ads_stat_rows"
            ALTER COLUMN "created_at"
            SET NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_ads_stat_rows"
            ALTER COLUMN "created_at" DROP NOT NULL
        `);
    }

}
