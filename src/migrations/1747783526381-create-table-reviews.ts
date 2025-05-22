import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableReviews1747783526381 implements MigrationInterface {
    name = 'CreateTableReviews1747783526381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "rating" integer NOT NULL, "comment" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "venue_id" uuid, "band_id" integer, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_892f659696877d5b0a4a37de098" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_90b3eebaf0820c00e1a434a1e19" FOREIGN KEY ("band_id") REFERENCES "bands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_90b3eebaf0820c00e1a434a1e19"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_892f659696877d5b0a4a37de098"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
    }

}
