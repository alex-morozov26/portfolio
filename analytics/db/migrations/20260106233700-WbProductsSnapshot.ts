import { MigrationInterface, QueryRunner } from "typeorm";

export class WbProductsSnapshot20260106233700 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_products"
            ADD "snapshot_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_products" DROP CONSTRAINT "UQ_084bcf465bd097f1e7f7f97fc3c"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_products"
            ADD CONSTRAINT "UQ_084bcf465bd097f1e7f7f97fc3c" UNIQUE ("nm_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_products" DROP COLUMN "snapshot_id"
        `);
    }

}
