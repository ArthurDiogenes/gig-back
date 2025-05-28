import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableMusics1748442582627 implements MigrationInterface {
    name = 'CreateTableMusics1748442582627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "musics" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "band_id" integer, CONSTRAINT "PK_a2e622f30df5467a860991af728" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "musics" ADD CONSTRAINT "FK_9901ed8dd25f040537091db0a93" FOREIGN KEY ("band_id") REFERENCES "bands"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "musics" DROP CONSTRAINT "FK_9901ed8dd25f040537091db0a93"`);
        await queryRunner.query(`DROP TABLE "musics"`);
    }

}
