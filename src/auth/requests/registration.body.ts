import { Type } from 'class-transformer'
import { IsNumber, IsString } from 'class-validator'

export class RegistrationBody {
  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsString()
  nickname: string

  @IsNumber()
  @Type(() => Number)
  age: number

  @IsString()
  email: string

  @IsString()
  password: string
}
