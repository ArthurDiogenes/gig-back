import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBandTable1745463155723 implements MigrationInterface {
  name = 'CreateBandTable1745463155723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bands" ("id" SERIAL NOT NULL, "band_name" character varying(255) NOT NULL, "city" character varying(255) NOT NULL, "genero" character varying(255) NOT NULL, "description" text, "contact" character varying(255), "user_id" uuid, CONSTRAINT "REL_a2250ce4a61c774bb5dcbea2a8" UNIQUE ("user_id"), CONSTRAINT "PK_9355783ed6ad7f73a4d6fe50ea1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bands" ADD CONSTRAINT "FK_a2250ce4a61c774bb5dcbea2a82" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bands" DROP CONSTRAINT "FK_a2250ce4a61c774bb5dcbea2a82"`,
    );
    await queryRunner.query(`DROP TABLE "bands"`);
  }
}
