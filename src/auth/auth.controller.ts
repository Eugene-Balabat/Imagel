import { BadRequestException, Body, ConflictException, Controller, Get, Inject, Param, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
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
import { DataSource } from 'typeorm'

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
    readonly mailingService: MailService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async authorize(@Body() body: AuthBody, @Res({ passthrough: true }) response: Response) {
    await this.dataSource.transaction(async (trx) => {
      const user = await this.authService.getUser(body.email, body.password, trx)

      if (!user) {
        throw new UnauthorizedException()
      }

      const token = await this.authService.generateNewToken({ userId: user.id })

      response.cookie('authToken', token)
    })
  }

  @Post('/registration')
  async registration(@Body() body: RegistrationBody) {
    await this.dataSource.transaction(async (trx) => {
      const userExistPerEmail = await this.authService.isUserExistPerEmail(body.email, trx)

      if (userExistPerEmail) {
        throw new ConflictException()
      }

      // const code = 123456
      const code = Math.floor(Math.random() * (999999 - 100000) + 100000)
      await this.mailingService.sendMail(code, body.email, body.firstName)

      await this.cacheService.set(body.email, { ...body, code }, this.configService.get('USER_REGISTRATION_REDIS_TTL'))
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
    return await this.dataSource.transaction(async (trx) => {
      return this.authService.isUserExistPerId(params.userId, trx)
    })
  }
}
