import { MigrationInterface, QueryRunner } from "typeorm";

export class WbOrdersSnapshot20260107041400 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a7328dafa66b0b5de0b3f38f20"
        `);
        await queryRunner.query(`
            ALTER TABLE "wb_orders"
            ADD "snapshot_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wb_orders" DROP COLUMN "snapshot_id"
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_a7328dafa66b0b5de0b3f38f20" ON "wb_orders" ("srid")
        `);
    }

}
