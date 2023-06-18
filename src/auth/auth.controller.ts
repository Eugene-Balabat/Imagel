import { Body, Controller, Get, InternalServerErrorException, Param, Post, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { AuthBody } from './requests/auth.body'
import { IsUserExistsParams } from './requests/is-user-exist.params'
import { RegistrationBody } from './requests/registration.body'

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async authorize(@Body() body: AuthBody, @Res() response: Response) {
    const token = await this.authService.generateNewUserToken(body.login, body.password)

    if (!token) {
      throw new InternalServerErrorException()
    }

    response.cookie('authToken', token)
  }

  @Post('/registration')
  async registration(@Body() body: RegistrationBody) {
    const code = Math.floor(Math.random() * (999999 - 100000) + 100000)
    console.log(code)
  }

  @UseGuards(AuthGuard)
  @Post('/unauth')
  async unAuthorize(@Res() response: Response) {
    response.clearCookie('authToken')
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
