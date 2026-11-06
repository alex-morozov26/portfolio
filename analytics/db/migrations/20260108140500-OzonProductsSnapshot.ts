import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonProductsSnapshot20260108140500 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD "snapshot_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP CONSTRAINT "UQ_a6af94c02a21c7c758426478c7b"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD CONSTRAINT "UQ_a6af94c02a21c7c758426478c7b" UNIQUE ("product_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP COLUMN "snapshot_id"
        `);
    }

}
