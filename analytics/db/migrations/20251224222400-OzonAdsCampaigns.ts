import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonAdsCampaigns20251224222400 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "ozon_ads_campaigns" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "campaign_id" bigint NOT NULL,
                "payment_type" character varying(30) NOT NULL,
                "title" character varying NOT NULL,
                "state" character varying(50) NOT NULL,
                "adv_object_type" character varying(15) NOT NULL,
                "from_date" date,
                "to_date" date,
                "autostop_status" character varying(30) NOT NULL,
                "is_autocreated" boolean NOT NULL DEFAULT false,
                "budget" bigint NOT NULL,
                "daily_budget" bigint NOT NULL,
                "weekly_budget" bigint NOT NULL,
                "placement" character varying array NOT NULL,
                "product_autopilot_strategy" character varying(20) NOT NULL,
                "autopilot_category_id" bigint,
                "autopilot_sku_add_mode" character varying(45),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "product_campaign_mode" character varying(30) NOT NULL,
                CONSTRAINT "UQ_fe0f71d92ca0acd5fc264e2962a" UNIQUE ("campaign_id"),
                CONSTRAINT "PK_2a036db044b46695c2ce26bea5c" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "ozon_ads_campaigns"
        `);
    }

}
