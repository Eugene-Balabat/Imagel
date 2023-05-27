import { Injectable } from '@nestjs/common'
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ImageEntity } from './image.model'

@Injectable()
@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int8' })
  id!: number

  @Column({ primary: false, type: 'varchar', length: 50, name: 'login' })
  login!: string

  @Column({ primary: false, type: 'varchar', length: 50, name: 'password', select: false })
  password!: string

  @Column({ primary: false, type: 'varchar', length: 50, name: 'nickname' })
  nickname!: string

  @OneToMany(() => ImageEntity, (image) => image.user)
  images!: ImageEntity[]
}
