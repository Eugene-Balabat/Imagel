import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { isUndefined, omitBy } from 'lodash'
import { UserEntity } from 'src/models/user.model'
import { DataSource, EntityManager } from 'typeorm'
import { RedisUserDataRG } from './interfaces/redis-registartion-user.interface'

@Injectable()
export class AuthService {
  constructor(private readonly dataSource: DataSource, private readonly jwtService: JwtService) {}

  public async isUserExist(conditions: Partial<Pick<UserEntity, 'id' | 'email'>>, trx?: EntityManager) {
    const usersCount = await (trx || this.dataSource).getRepository(UserEntity).count({ where: omitBy(conditions, isUndefined) })
    return Boolean(usersCount)
  }

  public async isUserExistById(userId: number, trx?: EntityManager) {
    const usersCount = await (trx || this.dataSource).getRepository(UserEntity).count({ where: { id: userId } })
    return Boolean(usersCount)
  }

  public async isUserExistPerEmail(email: string, trx?: EntityManager) {
    const usersCount = await (trx || this.dataSource).getRepository(UserEntity).count({ where: { email } })
    return Boolean(usersCount)
  }

  public async isUserExistPerNickname(nickname: string, trx?: EntityManager) {
    const usersCount = await (trx || this.dataSource).getRepository(UserEntity).count({ where: { nickname } })

    return Boolean(usersCount)
  }

  public async getUser(email: string, password: string, trx?: EntityManager) {
    return await (trx || this.dataSource).getRepository(UserEntity).findOneBy({ email, password })
  }

  public async generateNewToken(payload) {
    return await this.jwtService.signAsync({ ...payload })
  }

  public async registrateNewUser(userData: RedisUserDataRG, trx?: EntityManager) {
    const user = this.dataSource.getRepository(UserEntity).create({ password: userData.password, email: userData.email })
    await (trx || this.dataSource).getRepository(UserEntity).save(user)
  }
}
