import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVenuePhotoColumns1745455988301 implements MigrationInterface {
  name = 'AddVenuePhotoColumns1745455988301';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "venues" ADD "cover_photo" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "venues" ADD "profile_photo" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "venues" ADD "social_media" text`);
    await queryRunner.query(
      `ALTER TABLE "venues" DROP CONSTRAINT "PK_cb0f885278d12384eb7a81818be"`,
    );
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "venues" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "venues" ADD CONSTRAINT "PK_cb0f885278d12384eb7a81818be" PRIMARY KEY ("id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "venues" DROP CONSTRAINT "PK_cb0f885278d12384eb7a81818be"`,
    );
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "venues" ADD CONSTRAINT "PK_cb0f885278d12384eb7a81818be" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "social_media"`);
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "profile_photo"`);
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "cover_photo"`);
  }
}
