import { Body, Controller, Get, InternalServerErrorException, Param, Post, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { AuthBody } from './requests/auth.body'
import { IsUserExistsParams } from './requests/is-user-exist.params'
import { UserEntity } from 'src/models/user.model'
import { User } from 'src/decorators/user.decorator'

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async authorize(@Body() body: AuthBody, @Res({ passthrough: true }) response: Response) {
    const token = await this.authService.generateNewUserToken(body.login, body.password)

    if (!token) {
      throw new InternalServerErrorException()
    }

    response.cookie('authToken', token)
  }

  @UseGuards(AuthGuard)
  @Post('/unauth')
  async unAuthorize(@Res({ passthrough: true }) response: Response) {
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
