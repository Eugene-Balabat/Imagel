import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { IsNumberString, IsString } from 'class-validator'

class IsUserExistsParams {
  @IsNumberString()
  userId: string
}

class AuthParams {
  @IsString()
  login: string

  @IsString()
  password: string
}

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async Authorize(@Body() body: AuthParams) {
    return this.authService.authorizeUser(body.login, body.password)
  }

  @UseGuards(AuthGuard)
  @Get('/is-authorized')
  async isAuthorized() {
    return true
  }

  @Get('/is-user-exist/:userId')
  async isUserExist(@Param() params: IsUserExistsParams) {
    return this.authService.isUserExist(params.userId)
  }
}
