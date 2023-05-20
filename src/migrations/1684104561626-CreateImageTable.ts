import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateImageTable1684104561626 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'images',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'int8',
            unsigned: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          { name: 'title', type: 'varchar', length: '100' },
          { name: 'user_id', type: 'int8' },
        ],
        foreignKeys: [
          {
            name: 'userFK',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('images');
  }
}
