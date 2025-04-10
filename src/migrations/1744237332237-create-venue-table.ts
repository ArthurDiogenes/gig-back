import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVenueTable1744237332237 implements MigrationInterface {
    name = 'CreateVenueTable1744237332237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "venues" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "type" character varying(255) NOT NULL, "cep" character varying(255), "city" character varying(255), "description" character varying(255), "address" character varying(255), "contact" character varying(255), "user_id" uuid, CONSTRAINT "REL_a094359edfcc78b9a69573a3b9" UNIQUE ("user_id"), CONSTRAINT "PK_cb0f885278d12384eb7a81818be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "venues" ADD CONSTRAINT "FK_a094359edfcc78b9a69573a3b96" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "venues" DROP CONSTRAINT "FK_a094359edfcc78b9a69573a3b96"`);
        await queryRunner.query(`DROP TABLE "venues"`);
    }

}
