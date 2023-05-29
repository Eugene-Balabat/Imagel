import { IsNumber } from 'class-validator'

export class TokenPayload {
  @IsNumber()
  userId: string
}
