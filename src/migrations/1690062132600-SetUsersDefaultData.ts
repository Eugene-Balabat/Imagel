import { MigrationInterface, QueryRunner } from 'typeorm'

export class SetUsersDefaultData1690062132600 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`insert into users (password, nickname, email) values ('admin', 'admin', 'eugene.balabat@gmail.com')`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`delete from users where email = 'eugene.balabat@gmail.com'`)
  }
}
