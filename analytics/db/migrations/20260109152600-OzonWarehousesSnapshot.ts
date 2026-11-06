import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonWarehousesSnapshot20260109152600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_warehouses"
            ADD "snapshot_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_warehouses" DROP CONSTRAINT "UQ_2b55aebca3fe0bb27126116ce3c"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_warehouses"
            ADD CONSTRAINT "UQ_2b55aebca3fe0bb27126116ce3c" UNIQUE ("warehouse_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "ozon_warehouses" DROP COLUMN "snapshot_id"
        `);
    }

}
