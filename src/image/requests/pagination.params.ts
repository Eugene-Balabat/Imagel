import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class PaginationParams {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  limit = 2

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  page: number
}
