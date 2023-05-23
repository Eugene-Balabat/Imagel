import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UserEntity } from 'src/models/user.model'
import { DataSource } from 'typeorm'

@Injectable()
export class AuthService {
  constructor(private readonly dataSource: DataSource, private readonly jwtService: JwtService, private configService: ConfigService) {}

  public async isUserExist(userId) {
    const usersCount = await this.dataSource.getRepository(UserEntity).count({ where: { id: userId } })

    return Boolean(usersCount)
  }

  public async generateNewUserToken(login, password) {
    const user = await this.dataSource.getRepository(UserEntity).findOneBy({ login, password })

    if (!user) {
      throw new UnauthorizedException()
    }

    return this.jwtService.signAsync({ userId: user.id }, { secret: this.configService.get<string>('SECRET_KEY'), expiresIn: '5m' })
  }
}
