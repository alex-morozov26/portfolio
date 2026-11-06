import { MigrationInterface, QueryRunner } from "typeorm";

export class WbStocksSnapshot20260107145700 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_stocks"
            ADD "snapshot_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stocks" DROP CONSTRAINT "UQ_34b1420f291f040887386be6185"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_stocks"
            ADD CONSTRAINT "UQ_34b1420f291f040887386be6185" UNIQUE ("nm_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_stocks" DROP COLUMN "snapshot_id"
        `);
    }

}
