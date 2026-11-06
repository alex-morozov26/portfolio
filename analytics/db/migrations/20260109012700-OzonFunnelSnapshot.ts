import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonFunnelSnapshot20260109012700 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_funnel"
            ADD "snapshot_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_funnel" DROP CONSTRAINT "UQ_b88e5a39a24ca7decf25fb566ec"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_funnel"
            ADD CONSTRAINT "UQ_b88e5a39a24ca7decf25fb566ec" UNIQUE ("sku")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_funnel" DROP COLUMN "snapshot_id"
        `);
    }

}
