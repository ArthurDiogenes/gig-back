import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableContracts1747103809830 implements MigrationInterface {
    name = 'CreateTableContracts1747103809830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contracts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_name" character varying(255) NOT NULL, "event_date" date NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "event_type" character varying(255) NOT NULL, "budget" numeric(10,2) NOT NULL, "additional_details" text, "is_confirmed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "requester_id" uuid, "provider_id" integer, CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_69a4a277495a54b3b9785a0c529" FOREIGN KEY ("requester_id") REFERENCES "venues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_d3d0ee245878be853d23a31b75c" FOREIGN KEY ("provider_id") REFERENCES "bands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_d3d0ee245878be853d23a31b75c"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_69a4a277495a54b3b9785a0c529"`);
        await queryRunner.query(`DROP TABLE "contracts"`);
    }

}
