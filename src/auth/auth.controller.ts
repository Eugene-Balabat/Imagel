import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { BadRequestException, Body, Controller, Get, Param, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation } from '@nestjs/swagger'
import { Response } from 'express'
import { Redis } from 'ioredis'
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

    @InjectRedis()
    private redis: Redis,
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

  @ApiOperation({ summary: 'Add userdata in Redis storage. Send E-mail with confirmation code.' })
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

      await this.redis.set(body.email, JSON.stringify({ ...body, code }), 'EX', this.configService.get(EnvConfig.USER_REGISTRATION_REDIS_TTL_MS))
    })
  }

  @ApiOperation({ summary: 'Add new user in DB.' })
  @Post('/registration/confirm')
  async confirmRegistration(@Body() body: RegistrationConfrimBody) {
    await this.dataSource.transaction(async (trx) => {
      const storedData: RedisUserDataRG = JSON.parse(await this.redis.get(body.key))

      if (storedData.code !== body.code) {
        throw new BadRequestException()
      }

      await this.authService.registrateNewUser(storedData, trx)

      await this.redis.del(body.key)
    })
  }

  @ApiOperation({ summary: 'Unauthorization.' })
  @UseGuards(AuthGuard)
  @Post('/unauth')
  async unAuthorize(@Res() response: Response) {
    response.clearCookie(AuthCookies.AUTH_TOKEN)
  }

  @ApiOperation({ summary: 'Check Is user authorized.' })
  @UseGuards(AuthGuard)
  @Get('/is-authorized')
  async isAuthorized() {
    return true
  }

  @ApiOperation({ summary: 'Check Is user exist.' })
  @UseGuards(AuthGuard)
  @Get('/is-user-exist/:userId')
  async isUserExist(@Param() params: IsUserExistsParams) {
    return await this.dataSource.transaction(async (trx) => {
      return this.authService.isUserExistById(params.userId, trx)
    })
  }
}
