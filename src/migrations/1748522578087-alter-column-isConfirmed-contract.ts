import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterColumnIsConfirmedContract1748522578087 implements MigrationInterface {
    name = 'AlterColumnIsConfirmedContract1748522578087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" ALTER COLUMN "is_confirmed" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contracts" ALTER COLUMN "is_confirmed" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" ALTER COLUMN "is_confirmed" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "contracts" ALTER COLUMN "is_confirmed" SET NOT NULL`);
    }

}
