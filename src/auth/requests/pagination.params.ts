import { Type } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class PaginationParams {
  @IsNumber()
  @Type(() => Number)
  limit: number

  @IsNumber()
  @Type(() => Number)
  page: number

  constructor(limit?: number) {
    this.limit = limit | 2
  }
}
