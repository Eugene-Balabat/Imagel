import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { IsNumberString, IsString } from 'class-validator'
import { Response } from 'express'

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
  async authorize(@Body() body: AuthParams, @Res({ passthrough: true }) response: Response) {
    const token = await this.authService.generateNewUserToken(body.login, body.password)

    if (!token) {
      // server error
    }
    response.cookie('authToken', token)
  }

  @Post()
  async unAuthorize(@Res({ passthrough: true }) response: Response) {
    // response.cookie('authToken', token)
  }

  @UseGuards(AuthGuard)
  @Get('/is-authorized')
  async isAuthorized() {
    return true
  }

  @UseGuards(AuthGuard)
  @Get('/is-user-exist/:userId')
  async isUserExist(@Param() params: IsUserExistsParams) {
    return this.authService.isUserExist(params.userId)
  }
}
