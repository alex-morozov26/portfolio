import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonFunnel20251222165700 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "ozon_funnel_history" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "date" date NOT NULL,
                "revenue" double precision NOT NULL,
                "ordered_units" integer NOT NULL,
                "hits_view" integer NOT NULL,
                "hits_view_search" integer NOT NULL,
                "hits_view_pdp" integer NOT NULL,
                "hits_tocart" integer NOT NULL,
                "hits_tocart_search" integer NOT NULL,
                "hits_tocart_pdp" integer NOT NULL,
                "session_view" integer NOT NULL,
                "session_view_search" integer NOT NULL,
                "session_view_pdp" integer NOT NULL,
                "returns" integer NOT NULL,
                "cancellations" integer NOT NULL,
                "position_category" double precision NOT NULL,
                "funnelId" uuid,
                CONSTRAINT "PK_4d5223342881aa5887e815fe510" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ozon_funnel" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "sku" bigint NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_b88e5a39a24ca7decf25fb566ec" UNIQUE ("sku"),
                CONSTRAINT "PK_9c80021d46c7cc9e63b44c3a48e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_funnel_history"
            ADD CONSTRAINT "FK_2daf522b265991574d62ea7f2c9" FOREIGN KEY ("funnelId") REFERENCES "ozon_funnel"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_funnel_history" DROP CONSTRAINT "FK_2daf522b265991574d62ea7f2c9"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_funnel"
        `);
        await queryRunner.query(`
            DROP TABLE "ozon_funnel_history"
        `);
    }

}
