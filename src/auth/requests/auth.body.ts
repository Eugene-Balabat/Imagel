import { IsString } from 'class-validator'

export class AuthBody {
  @IsString()
  login: string

  @IsString()
  password: string
}
