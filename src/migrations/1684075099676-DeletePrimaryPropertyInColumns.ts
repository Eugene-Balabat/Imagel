import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class DeletePrimaryPropertyInColumns1684075099676 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('users', [
      {
        oldColumn: new TableColumn({
          name: 'login',
          isPrimary: true,
          type: 'int8',
          unsigned: true,
        }),
        newColumn: new TableColumn({
          name: 'login',
          type: 'int8',
          unsigned: true,
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'password',
          isPrimary: true,
          type: 'varchar',
          length: '50',
        }),
        newColumn: new TableColumn({
          name: 'password',
          type: 'varchar',
          length: '50',
        }),
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('users', [
      {
        oldColumn: new TableColumn({
          name: 'login',
          type: 'int8',
          unsigned: true,
        }),
        newColumn: new TableColumn({
          name: 'login',
          isPrimary: true,
          type: 'int8',
          unsigned: true,
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'password',
          type: 'varchar',
          length: '50',
        }),
        newColumn: new TableColumn({
          name: 'password',
          isPrimary: true,
          type: 'varchar',
          length: '50',
        }),
      },
    ]);
  }
}
