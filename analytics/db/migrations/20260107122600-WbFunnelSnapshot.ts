import { MigrationInterface, QueryRunner } from "typeorm";

export class WbFunnelSnapshot20260107122600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_funnel"
            ADD "snapshot_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_funnel" DROP CONSTRAINT "UQ_35ecf7c0904e3258841a5779777"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_funnel"
            ADD CONSTRAINT "UQ_35ecf7c0904e3258841a5779777" UNIQUE ("nm_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_funnel" DROP COLUMN "snapshot_id"
        `);
    }

}
