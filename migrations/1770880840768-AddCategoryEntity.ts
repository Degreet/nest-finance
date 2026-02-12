import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryEntity1770880840768 implements MigrationInterface {
    name = 'AddCategoryEntity1770880840768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" RENAME COLUMN "category" TO "categoryId"`);
        await queryRunner.query(`CREATE TYPE "public"."category_type_enum" AS ENUM('income', 'expense')`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" "public"."category_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_32b856438dffdc269fa84434d9f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_d3951864751c5812e70d033978d" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_d3951864751c5812e70d033978d"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_32b856438dffdc269fa84434d9f"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "categoryId" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TYPE "public"."category_type_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction" RENAME COLUMN "categoryId" TO "category"`);
    }

}
