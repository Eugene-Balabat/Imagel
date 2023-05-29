import { UserEntity } from 'src/models/user.model'

export class UserResponse {
  id: number
  nickname: string

  constructor(data: UserEntity) {
    this.id = data.id
    this.nickname = data.nickname
  }
}
