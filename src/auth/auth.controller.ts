import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { AuthBody } from './requests/auth.body'
import { IsUserExistsParams } from './requests/is-user-exist.params'

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async authorize(@Body() body: AuthBody, @Res({ passthrough: true }) response: Response) {
    const token = await this.authService.generateNewUserToken(body.login, body.password)

    if (!token) {
      // server error
    }

    response.cookie('authToken', token)
  }

  // @Post()
  // async unAuthorize(@Res({ passthrough: true }) response: Response) {
  //   // response.cookie('authToken', token)
  // }

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
