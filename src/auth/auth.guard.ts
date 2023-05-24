import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { DataSource } from 'typeorm'

interface RequestExtended extends Request {
  cookies: { authToken?: string }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly dataSource: DataSource) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<RequestExtended>()

    if (!request.cookies?.authToken) {
      throw new BadRequestException('Not authorize user.')
    }

    return true
  }
}
