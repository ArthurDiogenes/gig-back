import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPictureColumnsToBand1749574505708 implements MigrationInterface {
    name = 'AddPictureColumnsToBand1749574505708'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bands" ADD "profile_picture" character varying`);
        await queryRunner.query(`ALTER TABLE "bands" ADD "cover_picture" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bands" DROP COLUMN "cover_picture"`);
        await queryRunner.query(`ALTER TABLE "bands" DROP COLUMN "profile_picture"`);
    }

}
