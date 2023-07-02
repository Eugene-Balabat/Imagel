import { Type } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class PaginationParams {
  @IsNumber()
  @Type(() => Number)
  limit = 2

  @IsNumber()
  @Type(() => Number)
  page: number
}
