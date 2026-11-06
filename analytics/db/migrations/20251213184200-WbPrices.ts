import { MigrationInterface, QueryRunner } from "typeorm";

export class WbPrices20251213184200 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "wb_price_sizes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "sizeID" integer NOT NULL,
                "price" integer NOT NULL,
                "discountedPrice" numeric NOT NULL,
                "clubDiscountedPrice" numeric NOT NULL,
                "techSizeName" character varying NOT NULL,
                "priceRelId" uuid,
                CONSTRAINT "PK_9624833d638770e134b69143761" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wb_prices" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "nm_id" bigint NOT NULL,
                "vendor_code" character varying,
                "currency_iso_code_4217" character varying,
                "discount" integer,
                "club_discount" integer,
                "editable_size_price" boolean NOT NULL DEFAULT false,
                "is_bad_turnover" boolean NOT NULL DEFAULT false,
                CONSTRAINT "UQ_b9bbe40b61814cc95e636c9e7ad" UNIQUE ("nm_id"),
                CONSTRAINT "PK_b0bbd28e5437fe57c4a3d27a847" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_price_sizes"
            ADD CONSTRAINT "FK_f782c37b7a64ec42cb98cd314e6" FOREIGN KEY ("priceRelId") REFERENCES "wb_prices"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_price_sizes" DROP CONSTRAINT "FK_f782c37b7a64ec42cb98cd314e6"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_prices"
        `);
        await queryRunner.query(`
            DROP TABLE "wb_price_sizes"
        `);
    }

}
