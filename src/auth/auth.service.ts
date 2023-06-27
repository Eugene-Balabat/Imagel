import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserEntity } from 'src/models/user.model'
import { DataSource, EntityManager } from 'typeorm'
import { RedisUserDataRG } from './interfaces/redis-registartion-user.interface'

@Injectable()
export class AuthService {
  constructor(private readonly dataSource: DataSource, private readonly jwtService: JwtService) {}

  public async isUserExistPerId(userId: number, trx?: EntityManager) {
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
    await (trx || this.dataSource).getRepository(UserEntity).insert({ password: userData.password, email: userData.email })
  }
}
