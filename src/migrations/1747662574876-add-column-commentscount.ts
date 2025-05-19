import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnCommentscount1747662574876 implements MigrationInterface {
    name = 'AddColumnCommentscount1747662574876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "comments_count" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "comments_count"`);
    }

}
