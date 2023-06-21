import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { AuthBody } from './requests/auth.body'
import { IsUserExistsParams } from './requests/is-user-exist.params'
import { RegistrationBody } from './requests/registration.body'
import { MailService } from 'src/mail/mail.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { RegistrationConfrimBody } from './requests/registration.confirm.body'
import { RedisUserDataRG } from './interfaces/redis-registartion-user.interface'
import { ConfigService } from '@nestjs/config'

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    readonly mailingService: MailService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly configService: ConfigService,
  ) {}

  // Without 'passthrough: true' response is not sending back
  @Post()
  async authorize(@Body() body: AuthBody, @Res({ passthrough: true }) response: Response) {
    const token = await this.authService.generateNewUserToken(body.email, body.password)

    if (!token) {
      throw new InternalServerErrorException()
    }

    response.cookie('authToken', token)
  }

  @Post('/registration')
  async registration(@Body() body: RegistrationBody) {
    const userExistPerEmail = await this.authService.isUserExistPerEmail(body.email)

    if (userExistPerEmail) {
      throw new ConflictException()
    }

    // const code = 123456
    const code = Math.floor(Math.random() * (999999 - 100000) + 100000)
    await this.mailingService.sendMail(code, body.email, body.firstName)

    await this.cacheService.set(body.email, { ...body, code }, this.configService.get('USER_REGISTRATION_REDIS_TTL'))
  }

  @Post('/registration/confirm')
  async confirmRegistration(@Body() body: RegistrationConfrimBody) {
    const storedData = await this.cacheService.get<RedisUserDataRG>(body.key)

    if (storedData.code !== body.code) {
      throw new BadRequestException()
    }

    await this.authService.registrateNewUser(storedData)
    await this.cacheService.del(body.key)
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
    return this.authService.isUserExistPerId(params.userId)
  }
}
