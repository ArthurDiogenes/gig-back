import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnMembers1747513782207 implements MigrationInterface {
  name = 'AddColumnMembers1747513782207';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bands" ADD "members" smallint`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bands" DROP COLUMN "members"`);
  }
}
