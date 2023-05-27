import { Type } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class IsUserExistsParams {
  @IsNumber()
  @Type(() => Number)
  userId: number
}
