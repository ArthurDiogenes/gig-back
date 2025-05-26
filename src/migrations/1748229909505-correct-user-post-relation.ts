import { MigrationInterface, QueryRunner } from 'typeorm';

export class CorrectUserPostRelation1748229909505
  implements MigrationInterface
{
  name = 'CorrectUserPostRelation1748229909505';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Adiciona nova coluna user_id
    await queryRunner.query(`ALTER TABLE "posts" ADD "user_id" uuid`);

    // 2. Atualiza os dados: copia o user_id associado à banda
    await queryRunner.query(`
            UPDATE "posts"
            SET "user_id" = "bands"."user_id"
            FROM "bands"
            WHERE "posts"."author_id" = "bands"."id"
        `);

    // 3. Garante que user_id não é nulo após migração
    await queryRunner.query(
      `ALTER TABLE "posts" ALTER COLUMN "user_id" SET NOT NULL`,
    );

    // 4. Adiciona a nova FK
    await queryRunner.query(`
            ALTER TABLE "posts"
            ADD CONSTRAINT "FK_posts_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    // 5. Remove FK antiga
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_312c63be865c81b922e39c2475e"`,
    );

    // 6. Remove a coluna antiga author_id
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "author_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Adiciona a coluna author_id novamente
    await queryRunner.query(`ALTER TABLE "posts" ADD "author_id" integer`);

    // 2. Reinsere os dados, se possível
    await queryRunner.query(`
            UPDATE "posts"
            SET "author_id" = "bands"."id"
            FROM "bands"
            WHERE "posts"."user_id" = "bands"."user_id"
        `);

    // 3. Garante que author_id não é nulo
    await queryRunner.query(
      `ALTER TABLE "posts" ALTER COLUMN "author_id" SET NOT NULL`,
    );

    // 4. Adiciona a FK antiga de volta
    await queryRunner.query(`
            ALTER TABLE "posts"
            ADD CONSTRAINT "FK_312c63be865c81b922e39c2475e" FOREIGN KEY ("author_id") REFERENCES "bands"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    // 5. Remove a FK nova
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_posts_user"`,
    );

    // 6. Remove a coluna user_id
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "user_id"`);
  }
}
