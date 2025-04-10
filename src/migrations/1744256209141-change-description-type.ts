import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDescriptionType1744256209141 implements MigrationInterface {
    name = 'ChangeDescriptionType1744256209141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "venues" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "venues" ADD "description" character varying(255)`);
    }

}
