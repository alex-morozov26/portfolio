import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonStocksSnapshot20260109194600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_stocks"
            ADD "identity" character varying(64) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_stocks"
            ADD "snapshot_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_cad1a966b532b2fd47376e02a3" ON "ozon_stocks" ("datasource_id", "identity")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_cad1a966b532b2fd47376e02a3"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_stocks" DROP COLUMN "snapshot_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_stocks" DROP COLUMN "identity"
        `);
    }

}
