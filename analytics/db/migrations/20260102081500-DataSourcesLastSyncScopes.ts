import { MigrationInterface, QueryRunner } from "typeorm";

export class DataSourcesLastSyncScopes20260103081500 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "data_sources"
            ADD "last_sync_scopes" jsonb
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "data_sources" DROP COLUMN "last_sync_scopes"
        `);
    }

}
