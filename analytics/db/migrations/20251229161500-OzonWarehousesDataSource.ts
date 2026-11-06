import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonWarehousesDataSource20251229161500 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_warehouses"
            ADD "datasource_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_warehouses" DROP COLUMN "datasource_id"
        `);
    }

}
