import { MigrationInterface, QueryRunner } from "typeorm";

export class ContractStatus1760729708709 implements MigrationInterface {
    name = 'ContractStatus1760729708709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" RENAME COLUMN "is_confirmed" TO "status"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD "status" boolean`);
        await queryRunner.query(`ALTER TABLE "contracts" RENAME COLUMN "status" TO "is_confirmed"`);
    }

}
