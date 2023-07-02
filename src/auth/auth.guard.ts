import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { UserEntity } from 'src/models/user.model'
import { DataSource } from 'typeorm'
import { AuthCookies } from './auth.enum'
import { TokenPayload } from './requests/token.payload'

interface RequestExtended extends Request {
  cookies: { [AuthCookies.AUTH_TOKEN]?: string }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly dataSource: DataSource, private readonly JwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestExtended>()

    if (!request.cookies[AuthCookies.AUTH_TOKEN]) {
      throw new BadRequestException('Not authorize user.')
    }

    const tokenData = await this.JwtService.verify<TokenPayload>(request.cookies[AuthCookies.AUTH_TOKEN])

    request.user = await this.dataSource.getRepository(UserEntity).findOneBy({ id: tokenData.userId })

    if (!request.user) {
      throw new BadRequestException('Not user exist.')
    }

    return true
  }
}
