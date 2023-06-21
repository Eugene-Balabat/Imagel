import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserEntity } from 'src/models/user.model'
import { DataSource } from 'typeorm'
import { RedisUserDataRG } from './interfaces/redis-registartion-user.interface'

@Injectable()
export class AuthService {
  constructor(private readonly dataSource: DataSource, private readonly jwtService: JwtService) {}

  public async isUserExistPerId(userId: number) {
    const usersCount = await this.dataSource.getRepository(UserEntity).count({ where: { id: userId } })

    return Boolean(usersCount)
  }

  public async isUserExistPerEmail(email: string) {
    const usersCount = await this.dataSource.getRepository(UserEntity).count({ where: { email } })

    return Boolean(usersCount)
  }

  public async isUserExistPerNickname(nickname: string) {
    const usersCount = await this.dataSource.getRepository(UserEntity).count({ where: { nickname } })

    return Boolean(usersCount)
  }

  public async generateNewUserToken(email: string, password: string) {
    const user = await this.dataSource.getRepository(UserEntity).findOneBy({ email, password })

    if (!user) {
      throw new UnauthorizedException()
    }

    return this.jwtService.signAsync({ userId: user.id })
  }

  public async registrateNewUser(userData: RedisUserDataRG) {
    await this.dataSource.getRepository(UserEntity).insert({ password: userData.password, email: userData.email })
  }
}
