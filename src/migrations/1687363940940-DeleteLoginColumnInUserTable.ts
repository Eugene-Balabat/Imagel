import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class DeleteLoginColumnInUserTable1687363940940 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'login')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', new TableColumn({ name: 'login', isNullable: false, type: 'varchar', length: '50', default: "'Empty'" }))
  }
}
