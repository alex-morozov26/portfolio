import { MigrationInterface, QueryRunner } from "typeorm";

export class WbAdsStats20251215123700 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "wb_ads_stat_boosters" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "avg_position" integer NOT NULL,
                "date" date NOT NULL,
                "nm" integer NOT NULL,
                "statId" uuid,
                CONSTRAINT "PK_d1b0aabfb471aa2c04ad0ce620e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_ads_stat_day_app_nms" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "atbs" integer NOT NULL,
                "canceled" integer NOT NULL,
                "clicks" integer NOT NULL,
                "cpc" double precision NOT NULL,
                "cr" double precision NOT NULL,
                "ctr" double precision NOT NULL,
                "name" character varying NOT NULL,
                "nm_id" integer NOT NULL,
                "orders" integer NOT NULL,
                "shks" integer NOT NULL,
                "sum" double precision NOT NULL,
                "sum_price" double precision NOT NULL,
                "views" integer NOT NULL,
                "appId" uuid,
                CONSTRAINT "PK_6c504235c4a741711ddd94ea00d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_ads_stat_day_apps" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "app_type" integer NOT NULL,
                "atbs" integer NOT NULL,
                "canceled" integer NOT NULL,
                "clicks" integer NOT NULL,
                "cpc" double precision NOT NULL,
                "cr" double precision NOT NULL,
                "ctr" double precision NOT NULL,
                "orders" integer NOT NULL,
                "shks" integer NOT NULL,
                "sum" double precision NOT NULL,
                "sum_price" double precision NOT NULL,
                "views" integer NOT NULL,
                "dayId" uuid,
                CONSTRAINT "PK_bd258a6fc73631990f5737361d2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_ads_stat_days" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "atbs" integer NOT NULL,
                "canceled" integer NOT NULL,
                "date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "clicks" integer NOT NULL,
                "cpc" double precision NOT NULL,
                "cr" double precision NOT NULL,
                "ctr" double precision NOT NULL,
                "orders" integer NOT NULL,
                "shks" integer NOT NULL,
                "sum" double precision NOT NULL,
                "sum_price" double precision NOT NULL,
                "views" integer NOT NULL,
                "statId" uuid,
                CONSTRAINT "PK_43ab5de3ffee517cb56852881b1" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_ads_stats" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "advert_id" integer NOT NULL,
                "atbs" integer NOT NULL,
                "canceled" integer NOT NULL,
                "clicks" integer NOT NULL,
                "cpc" double precision NOT NULL,
                "cr" double precision NOT NULL,
                "ctr" double precision NOT NULL,
                "orders" integer NOT NULL,
                "shks" integer NOT NULL,
                "sum" double precision NOT NULL,
                "sum_price" double precision NOT NULL,
                "views" integer NOT NULL,
                CONSTRAINT "PK_1afb7bf51febe04b51f9f7c427c" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_ads_stat_boosters"
            ADD CONSTRAINT "FK_664e91415a71759a4c52597fdc9" FOREIGN KEY ("statId") REFERENCES "wb_ads_stats"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_ads_stat_day_app_nms"
            ADD CONSTRAINT "FK_4577a5f372ddd830366c2123d80" FOREIGN KEY ("appId") REFERENCES "wb_ads_stat_day_apps"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_ads_stat_day_apps"
            ADD CONSTRAINT "FK_37b8866a451a151cd6d2d764f93" FOREIGN KEY ("dayId") REFERENCES "wb_ads_stat_days"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_ads_stat_days"
            ADD CONSTRAINT "FK_4c9e8c56220119f850942d33263" FOREIGN KEY ("statId") REFERENCES "wb_ads_stats"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_ads_stat_days" DROP CONSTRAINT "FK_4c9e8c56220119f850942d33263"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_ads_stat_day_apps" DROP CONSTRAINT "FK_37b8866a451a151cd6d2d764f93"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_ads_stat_day_app_nms" DROP CONSTRAINT "FK_4577a5f372ddd830366c2123d80"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_ads_stat_boosters" DROP CONSTRAINT "FK_664e91415a71759a4c52597fdc9"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_ads_stats"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_ads_stat_days"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_ads_stat_day_apps"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_ads_stat_day_app_nms"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_ads_stat_boosters"
        `);
    }

}
