import { MigrationInterface, QueryRunner } from "typeorm";

export class WbAdsCampaigns20251215075600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "wb_ads_campaigns" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "end_time" TIMESTAMP WITH TIME ZONE,
                "create_time" TIMESTAMP WITH TIME ZONE,
                "change_time" TIMESTAMP WITH TIME ZONE,
                "start_time" TIMESTAMP WITH TIME ZONE,
                "name" character varying,
                "advert_id" integer,
                "status" integer,
                "type" integer,
                "payment_type" character varying,
                "bid_type" integer,
                CONSTRAINT "UQ_2f5a17515535b557a7e38567700" UNIQUE ("advert_id"),
                CONSTRAINT "PK_10a84c68a18ad11386c4ad6e058" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "wb_ads_campaigns"
        `);
    }

}
