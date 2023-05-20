import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1683836502513 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'int8',
            unsigned: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          { name: 'login', isPrimary: true, type: 'varchar', length: '50' },
          { name: 'password', isPrimary: true, type: 'varchar', length: '50' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
