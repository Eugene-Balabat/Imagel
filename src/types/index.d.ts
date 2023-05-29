declare namespace Express {
  import { UserEntity } from 'src/models/user.model'

  export interface Request {
    userId?: number
    userLogin?: string
    user: UserEntity
  }
}
