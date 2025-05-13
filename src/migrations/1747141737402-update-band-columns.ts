import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBandColumns1747141737402 implements MigrationInterface {
  name = 'UpdateBandColumns1747141737402';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bands" RENAME COLUMN "genero" TO "genre"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bands" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "bands" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "bands" ADD "deleted_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bands" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "bands" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "bands" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "bands" DROP COLUMN "genre"`);
    await queryRunner.query(
      `ALTER TABLE "bands" ADD "genero" character varying(255) NOT NULL`,
    );
  }
}
