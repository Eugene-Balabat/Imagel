import { Injectable } from '@nestjs/common'
import { UserEntity } from 'src/models/user.model'
import { DataSource } from 'typeorm'

@Injectable()
export class AuthService {
  constructor(private readonly dataSource: DataSource) {}

  public async isUserExist(userId) {
    const usersCount = await this.dataSource.getRepository(UserEntity).count({ where: { id: userId } })

    return Boolean(usersCount)
  }

  public async authorizeUser(login, password) {
    return true
  }
}
