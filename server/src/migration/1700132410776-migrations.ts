import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1700132410776 implements MigrationInterface {
  name = "Migrations1700132410776";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "asset" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "criteria" character varying NOT NULL, "file" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "sync_status" ("id" SERIAL NOT NULL, "lastUpdate" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_86336482262ab8d5b548a4a71b7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "asset" ADD CONSTRAINT "FK_e469bb1b58d7ae4d9527d35ca01" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "sync_status" ADD CONSTRAINT "FK_da9a3f596feaef3a2470947853a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sync_status" DROP CONSTRAINT "FK_da9a3f596feaef3a2470947853a"`
    );
    await queryRunner.query(
      `ALTER TABLE "asset" DROP CONSTRAINT "FK_e469bb1b58d7ae4d9527d35ca01"`
    );
    await queryRunner.query(`DROP TABLE "sync_status"`);
    await queryRunner.query(`DROP TABLE "asset"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
