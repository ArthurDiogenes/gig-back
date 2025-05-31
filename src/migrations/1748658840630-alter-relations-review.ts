import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterRelationsReview1748658840630 implements MigrationInterface {
    name = 'AlterRelationsReview1748658840630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_892f659696877d5b0a4a37de098"`);
        await queryRunner.query(`ALTER TABLE "reviews" RENAME COLUMN "venue_id" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_728447781a30bc3fcfe5c2f1cdf" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_728447781a30bc3fcfe5c2f1cdf"`);
        await queryRunner.query(`ALTER TABLE "reviews" RENAME COLUMN "user_id" TO "venue_id"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_892f659696877d5b0a4a37de098" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
