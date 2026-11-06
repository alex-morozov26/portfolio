import { MigrationInterface, QueryRunner } from "typeorm";

export class WbPricesSnapshot20260107023400 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_prices"
            ADD "snapshot_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_prices" DROP CONSTRAINT "UQ_b9bbe40b61814cc95e636c9e7ad"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_prices"
            ADD CONSTRAINT "UQ_b9bbe40b61814cc95e636c9e7ad" UNIQUE ("nm_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_prices" DROP COLUMN "snapshot_id"
        `);
    }

}
