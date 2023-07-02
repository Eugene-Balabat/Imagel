import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { BadRequestException, Body, Controller, Get, Inject, Param, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation } from '@nestjs/swagger'
import { Cache } from 'cache-manager'
import { Response } from 'express'
import { MailService } from 'src/mail/mail.service'
import { DataSource } from 'typeorm'
import { EnvConfig } from '../app.enum'
import { AuthCookies } from './auth.enum'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { RedisUserDataRG } from './interfaces/redis-registartion-user.interface'
import { AuthBody } from './requests/auth.body'
import { IsUserExistsParams } from './requests/is-user-exist.params'
import { RegistrationConfrimBody } from './requests/registration-confirm.body'
import { RegistrationBody } from './requests/registration.body'

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
    private readonly mailingService: MailService,
    private readonly configService: ConfigService,

    @Inject(CACHE_MANAGER)
    private cacheService: Cache,
  ) {}

  @ApiOperation({ summary: 'Authorization.' })
  @Post()
  async authorize(@Body() body: AuthBody, @Res({ passthrough: true }) response: Response) {
    await this.dataSource.transaction(async (trx) => {
      const user = await this.authService.getUser(body.email, body.password, trx)

      if (!user) {
        throw new UnauthorizedException()
      }

      const token = await this.authService.generateNewToken({ userId: user.id })

      response.cookie(AuthCookies.AUTH_TOKEN, token)
    })
  }

  @Post('/registration')
  async registration(@Body() body: RegistrationBody) {
    await this.dataSource.transaction(async (trx) => {
      const userExistPerEmail = await this.authService.isUserExistPerEmail(body.email, trx)

      if (userExistPerEmail) {
        throw new BadRequestException(`Is user with this email already exist.`)
      }

      // const code = 123456
      const code = Math.floor(Math.random() * (999999 - 100000) + 100000)
      await this.mailingService.sendMail(code, body.email, body.firstName)

      await this.cacheService.set(body.email, { ...body, code }, this.configService.get(EnvConfig.USER_REGISTRATION_REDIS_TTL_MS))
    })
  }

  @Post('/registration/confirm')
  async confirmRegistration(@Body() body: RegistrationConfrimBody) {
    await this.dataSource.transaction(async (trx) => {
      const storedData = await this.cacheService.get<RedisUserDataRG>(body.key)

      if (storedData.code !== body.code) {
        throw new BadRequestException()
      }

      await this.authService.registrateNewUser(storedData, trx)

      await this.cacheService.del(body.key)
    })
  }

  @UseGuards(AuthGuard)
  @Post('/unauth')
  async unAuthorize(@Res() response: Response) {
    response.clearCookie(AuthCookies.AUTH_TOKEN)
  }

  @UseGuards(AuthGuard)
  @Get('/is-authorized')
  async isAuthorized() {
    return true
  }

  @UseGuards(AuthGuard)
  @Get('/is-user-exist/:userId')
  async isUserExist(@Param() params: IsUserExistsParams) {
    return await this.dataSource.transaction(async (trx) => {
      return this.authService.isUserExistById(params.userId, trx)
    })
  }
}
