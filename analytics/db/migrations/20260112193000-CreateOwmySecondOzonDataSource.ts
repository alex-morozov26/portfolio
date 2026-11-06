import { MigrationInterface, QueryRunner } from "typeorm";
import { encrypt } from 'src/utils/crypto';

export class CreateOwmySecondOzonDataSource20260112193000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const projectId = process.env.PROJECT_OWMY_ID!;
        const ozonSecondDsId = process.env.DATASOURCE_OWMY_OZON_SECOND_ID!;

        const ozonSecondClientId = encrypt(process.env.DATASOURCE_OWMY_OZON_SECOND_CLIENT_ID!);
        const ozonSecondApiKey = encrypt(process.env.DATASOURCE_OWMY_OZON_SECOND_API_KEY!);
        const ozonSecondPerfClientId = encrypt(process.env.DATASOURCE_OWMY_OZON_SECOND_PERFORMANCE_CLIENT_ID!);
        const ozonSecondPerfClientSecret = encrypt(process.env.DATASOURCE_OWMY_OZON_SECOND_PERFORMANCE_CLIENT_SECRET!);

        await queryRunner.query(`
            INSERT INTO "data_sources"
                ("id","type","is_active","projectId",
                 "ozon_client_id","ozon_api_key",
                 "ozon_performance_client_id","ozon_performance_client_secret","wb_api_token")
            VALUES
                ('${ozonSecondDsId}','ozon',true,'${projectId}',
                 '${ozonSecondClientId}','${ozonSecondApiKey}',
                 '${ozonSecondPerfClientId}','${ozonSecondPerfClientSecret}',NULL)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const ozonSecondDsId = process.env.DATASOURCE_OWMY_OZON_SECOND_ID!;

        await queryRunner.query(`
            DELETE FROM "data_sources" WHERE id = '${ozonSecondDsId}'
        `);
    }
}
