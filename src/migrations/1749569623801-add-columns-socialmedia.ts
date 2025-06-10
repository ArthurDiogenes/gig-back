import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnsSocialmedia1749569623801 implements MigrationInterface {
    name = 'AddColumnsSocialmedia1749569623801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "social_media"`);
        await queryRunner.query(`ALTER TABLE "venues" ADD "twitter" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "venues" ADD "instagram" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "venues" ADD "facebook" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "bands" ADD "twitter" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "bands" ADD "instagram" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "bands" ADD "facebook" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bands" DROP COLUMN "facebook"`);
        await queryRunner.query(`ALTER TABLE "bands" DROP COLUMN "instagram"`);
        await queryRunner.query(`ALTER TABLE "bands" DROP COLUMN "twitter"`);
        await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "facebook"`);
        await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "instagram"`);
        await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "twitter"`);
        await queryRunner.query(`ALTER TABLE "venues" ADD "social_media" text`);
    }

}
