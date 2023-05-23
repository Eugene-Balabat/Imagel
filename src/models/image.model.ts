import { Injectable } from '@nestjs/common'
import { BaseEntity, BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from './user.model'

@Injectable()
@Entity({ name: 'images' })
export class ImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int8' })
  id!: number

  @Column({ primary: false, type: 'varchar', length: 100, name: 'title' })
  title!: string

  @Column({ primary: false, type: 'timestamp', name: 'date', default: () => 'NOW()' })
  date!: Date

  @Column({ primary: false, type: 'int8', name: 'user_id' })
  userId!: number

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: UserEntity

  @BeforeInsert()
  addDate() {
    console.log(`Added image for user ${this.userId}`)
  }
}
