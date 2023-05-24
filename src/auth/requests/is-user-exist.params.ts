import { Type } from 'class-transformer'
import { IsNumberString } from 'class-validator'

export class IsUserExistsParams {
  @IsNumberString()
  @Type(() => Number)
  userId: number
}
