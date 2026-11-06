import { MigrationInterface, QueryRunner } from "typeorm";
import { encrypt } from 'src/utils/crypto';

export class CreateOwmyProject20251227184300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const projectId = process.env.PROJECT_OWMY_ID!;
        const projectName = process.env.PROJECT_OWMY_NAME!;
        const ozonDsId = process.env.DATASOURCE_OWMY_OZON_ID!;
        const wbDsId = process.env.DATASOURCE_OWMY_WB_ID!;
        const rootUsername = process.env.ROOT_USER_NAME!;

        const ozonClientId = encrypt(process.env.DATASOURCE_OWMY_OZON_CLIENT_ID!);
        const ozonApiKey = encrypt(process.env.DATASOURCE_OWMY_OZON_API_KEY!);
        const ozonPerfClientId = encrypt(process.env.DATASOURCE_OWMY_OZON_PERFORMANCE_CLIENT_ID!);
        const ozonPerfClientSecret = encrypt(process.env.DATASOURCE_OWMY_OZON_PERFORMANCE_CLIENT_SECRET!);
        const wbApiToken = encrypt(process.env.DATASOURCE_OWMY_WB_API_TOKEN!);

        const users = await queryRunner.query(`
            SELECT id FROM "users" WHERE username = '${rootUsername}'
        `);
        if (!users.length) throw new Error('Root пользователя нет в базе!');
        const userId = users[0].id;

        await queryRunner.query(`
            INSERT INTO "projects" ("id", "name", "is_active")
            VALUES ('${projectId}', '${projectName}', true)
        `);
        await queryRunner.query(`
            INSERT INTO "project_users" ("usersId", "projectsId")
            VALUES ('${userId}', '${projectId}')
        `);
        await queryRunner.query(`
            INSERT INTO "data_sources" 
                ("id","type","is_active","projectId","ozon_client_id","ozon_api_key","ozon_performance_client_id","ozon_performance_client_secret","wb_api_token")
            VALUES
                ('${ozonDsId}','ozon',true,'${projectId}','${ozonClientId}','${ozonApiKey}','${ozonPerfClientId}','${ozonPerfClientSecret}',NULL)
        `);
        await queryRunner.query(`
            INSERT INTO "data_sources" 
                ("id","type","is_active","projectId","ozon_client_id","ozon_api_key","ozon_performance_client_id","ozon_performance_client_secret","wb_api_token")
            VALUES
                ('${wbDsId}','wb',true,'${projectId}',NULL,NULL,NULL,NULL,'${wbApiToken}')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const projectId = process.env.PROJECT_OWMY_ID!;
  
        await queryRunner.query(`
            DELETE FROM "project_users" WHERE "projectsId" = '${projectId}'
        `);
        await queryRunner.query(`
            DELETE FROM "projects" WHERE id = '${projectId}'
        `);
    }
}
