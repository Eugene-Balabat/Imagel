import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsString } from 'class-validator'

export class RegistrationConfrimBody {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  code: number

  @ApiProperty()
  @IsString()
  key: string
}
