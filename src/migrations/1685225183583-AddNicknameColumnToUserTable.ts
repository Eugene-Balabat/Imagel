import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddNicknameColumnToUserTable1685225183583 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'nickname',
        isNullable: false,
        type: 'varchar',
        length: '50',
        default: "'No Nickname'",
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'nickname')
  }
}
