import { MigrationInterface, QueryRunner } from "typeorm";

export class ProjectsAndDataSources20251227024200 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "data_sources" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type" character varying(20) NOT NULL,
                "ozon_client_id" character varying,
                "ozon_api_key" character varying,
                "ozon_performance_client_id" character varying,
                "ozon_performance_client_secret" character varying,
                "wb_api_token" character varying,
                "is_active" boolean NOT NULL DEFAULT true,
                "last_sync_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "projectId" uuid,
                CONSTRAINT "PK_dc70b1c6b641726739857fd938d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "projects" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "project_users" (
                "usersId" uuid NOT NULL,
                "projectsId" uuid NOT NULL,
                CONSTRAINT "PK_5da8dcbd4670a630f026951796a" PRIMARY KEY ("usersId", "projectsId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_f9195fdfbbf029e8509d152f52" ON "project_users" ("usersId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_f85de63d78d882b8dfb7f82b1e" ON "project_users" ("projectsId")
        `);
        await queryRunner.query(`
            ALTER TABLE "data_sources"
            ADD CONSTRAINT "FK_709c75e305dde83efb9215b035b" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "project_users"
            ADD CONSTRAINT "FK_f9195fdfbbf029e8509d152f529" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "project_users"
            ADD CONSTRAINT "FK_f85de63d78d882b8dfb7f82b1e7" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "project_users" DROP CONSTRAINT "FK_f85de63d78d882b8dfb7f82b1e7"
        `);
        await queryRunner.query(`
            ALTER TABLE "project_users" DROP CONSTRAINT "FK_f9195fdfbbf029e8509d152f529"
        `);
        await queryRunner.query(`
            ALTER TABLE "data_sources" DROP CONSTRAINT "FK_709c75e305dde83efb9215b035b"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_f85de63d78d882b8dfb7f82b1e"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_f9195fdfbbf029e8509d152f52"
        `);
        await queryRunner.query(`
            DROP TABLE "project_users"
        `);
        await queryRunner.query(`
            DROP TABLE "projects"
        `);
        await queryRunner.query(`
            DROP TABLE "data_sources"
        `);
    }

}
