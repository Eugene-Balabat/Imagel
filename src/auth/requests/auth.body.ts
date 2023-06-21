import { IsString } from 'class-validator'

export class AuthBody {
  @IsString()
  email: string

  @IsString()
  password: string
}
