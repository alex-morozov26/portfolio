import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncSnapshots20260106222000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "sync_snapshots" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "datasource_id" uuid NOT NULL,
                "scope" character varying(30) NOT NULL,
                "status" character varying(10) NOT NULL,
                "mode" character varying(10) NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_2af40c1d54c967a89cdd2884e30" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_snapshot_active" ON "sync_snapshots" ("datasource_id", "scope", "status")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."idx_snapshot_active"
        `);
        await queryRunner.query(`
            DROP TABLE "sync_snapshots"
        `);
    }

}
