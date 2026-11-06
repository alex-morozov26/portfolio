import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonPricesSnapshot20260108235900 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_prices"
            ADD "snapshot_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices" DROP CONSTRAINT "UQ_f5f2cfa8fa87d3287781588356c"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_prices"
            ADD CONSTRAINT "UQ_f5f2cfa8fa87d3287781588356c" UNIQUE ("product_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_prices" DROP COLUMN "snapshot_id"
        `);
    }

}
