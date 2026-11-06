import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncLogs20251231033700 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "sync_logs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "data_source_id" uuid NOT NULL,
                "type" character varying(20) NOT NULL,
                "scope" character varying(30) NOT NULL,
                "mode" character varying(10) NOT NULL,
                "status" character varying(10) NOT NULL,
                "started_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "finished_at" TIMESTAMP WITH TIME ZONE,
                "errors" jsonb NOT NULL DEFAULT '[]',
                CONSTRAINT "PK_f441fe15484e077c80ddec89336" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "sync_logs"
        `);
    }

}
