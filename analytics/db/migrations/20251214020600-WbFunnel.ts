import { MigrationInterface, QueryRunner } from "typeorm";

export class WbFunnel20251214020600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "wb_funnel_history" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "date" date NOT NULL,
                "open_count" integer NOT NULL,
                "cart_count" integer NOT NULL,
                "order_count" integer NOT NULL,
                "order_sum" integer NOT NULL,
                "buyout_count" integer NOT NULL,
                "buyout_sum" integer NOT NULL,
                "buyout_percent" integer NOT NULL,
                "add_to_cart_conversion" integer NOT NULL,
                "cart_to_order_conversion" integer NOT NULL,
                "add_to_wishlist_count" integer NOT NULL,
                "funnelId" uuid,
                CONSTRAINT "PK_fd6f9602d52d0e60ee744ad6383" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_funnel" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "nm_id" bigint NOT NULL,
                "title" character varying NOT NULL,
                "vendor_code" character varying NOT NULL,
                "brand_name" character varying NOT NULL,
                "subject_id" bigint NOT NULL,
                "subject_name" character varying NOT NULL,
                CONSTRAINT "UQ_35ecf7c0904e3258841a5779777" UNIQUE ("nm_id"),
                CONSTRAINT "PK_6345c18b6e50db5423463c4b669" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_funnel_history"
            ADD CONSTRAINT "FK_ee2be92cba617fe05f12245cbd3" FOREIGN KEY ("funnelId") REFERENCES "wb_funnel"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_funnel_history" DROP CONSTRAINT "FK_ee2be92cba617fe05f12245cbd3"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_funnel"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_funnel_history"
        `);
    }

}
