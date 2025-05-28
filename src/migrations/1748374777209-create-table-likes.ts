import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableLikes1748374777209 implements MigrationInterface {
    name = 'CreateTableLikes1748374777209'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_posts_user"`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "post_id" integer, CONSTRAINT "UQ_723da61de46f65bb3e3096750d2" UNIQUE ("user_id", "post_id"), CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "likes"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "likes_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_3f519ed95f775c781a254089171" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_741df9b9b72f328a6d6f63e79ff" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_741df9b9b72f328a6d6f63e79ff"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_3f519ed95f775c781a254089171"`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "likes_count"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "likes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_posts_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
