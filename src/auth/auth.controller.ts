import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/is-user-exist/:userId')
  async isUserExist(@Param('userId') userId: number) {
    return this.authService.isUserExist(userId);
  }

  @UseGuards(AuthGuard)
  @Get('/is-authorized')
  async isAuthorized() {
    return true;
  }
}
