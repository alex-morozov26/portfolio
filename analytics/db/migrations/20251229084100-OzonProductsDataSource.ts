import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonProductsDataSource20251229084100 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_products"
            ADD "datasource_id" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ozon_products" DROP COLUMN "datasource_id"
        `);
    }

}
