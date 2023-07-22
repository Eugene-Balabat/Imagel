import { ApiProperty } from '@nestjs/swagger'
import { IsNumberString } from 'class-validator'

export class UserRequestParams {
  @ApiProperty()
  @IsNumberString()
  userId: string
}
