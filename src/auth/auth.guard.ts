import { BadRequestException, CanActivate, ExecutionContext, Injectable, UsePipes, ValidationPipe } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { UserEntity } from 'src/models/user.model'
import { DataSource } from 'typeorm'
import { TokenPayload } from './requests/token.payload'
import { log } from 'console'

interface RequestExtended extends Request {
  cookies: { authToken?: string }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly dataSource: DataSource, private readonly JwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestExtended>()

    if (!request.cookies?.authToken) {
      throw new BadRequestException('Not authorize user.')
    }

    const tokenData = await this.JwtService.verify<TokenPayload>(request.cookies.authToken)

    request.user = await this.dataSource.getRepository(UserEntity).findOneBy({ id: Number(tokenData.userId) })

    return true
  }
}
