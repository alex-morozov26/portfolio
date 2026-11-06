import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";

export class CreateRootUser20251212114000 implements MigrationInterface {

    readonly rootUsername = process.env.ROOT_USER_NAME!;
    readonly rootPassword = process.env.ROOT_USER_PASSWORD!;

    public async up(queryRunner: QueryRunner): Promise<void> {
        const passwordHash = await bcrypt.hash(this.rootPassword, 10);

        await queryRunner.query(`
            INSERT INTO "users" ("username", "password_hash")
            VALUES ('${this.rootUsername}', '${passwordHash}');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "users" WHERE username = '${this.rootUsername}';
        `);
    }
}