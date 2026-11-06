import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncLogsSnapshots20260107014200 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "sync_logs"
            ADD "snapshot_ids" uuid array NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "sync_logs" DROP COLUMN "snapshot_ids"
        `);
    }

}
