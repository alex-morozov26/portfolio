import { MigrationInterface, QueryRunner } from "typeorm";

export class OzonWarehouses20251223144100 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "ozon_warehouses" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "cluster_id" bigint NOT NULL,
                "macrolocal_cluster_id" bigint NOT NULL,
                "cluster_name" character varying NOT NULL,
                "cluster_type" character varying(30) NOT NULL,
                "warehouse_id" bigint NOT NULL,
                "warehouse_type" character varying(30) NOT NULL,
                "warehouse_name" character varying NOT NULL,
                CONSTRAINT "UQ_2b55aebca3fe0bb27126116ce3c" UNIQUE ("warehouse_id"),
                CONSTRAINT "PK_6085c0cda14978be3f3a1d1b4a7" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "ozon_warehouses"
        `);
    }

}
