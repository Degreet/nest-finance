import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1770807307610 implements MigrationInterface {
    name = 'InitialSchema1770807307610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM('income', 'expense')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "type" "public"."transaction_type_enum" NOT NULL, "accountId" integer NOT NULL, "amount" numeric(15,2) NOT NULL, "category" character varying NOT NULL, "description" character varying, "date" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."account_type_enum" AS ENUM('manual_card', 'cash', 'credit', 'debt')`);
        await queryRunner.query(`CREATE TABLE "account" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" "public"."account_type_enum" NOT NULL, "currency" character varying NOT NULL, "balance" numeric(15,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_3d6e89b14baa44a71870450d14d" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_3d6e89b14baa44a71870450d14d"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TYPE "public"."account_type_enum"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
    }

}
