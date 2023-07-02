import { Type } from 'class-transformer'
import { IsNumber, IsString } from 'class-validator'

export class RegistrationConfrimBody {
  @IsNumber()
  @Type(() => Number)
  code: number

  @IsString()
  key: string
}
