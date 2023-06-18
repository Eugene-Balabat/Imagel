import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddEmailColumnToUserTable1687120753781 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'email',
        isNullable: false,
        type: 'varchar',
        length: '100',
        default: "'Empty'",
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'email')
  }
}
