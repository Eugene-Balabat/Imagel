import { IsNumberString } from 'class-validator'

export class UserRequestParams {
  @IsNumberString()
  userId: string
}
