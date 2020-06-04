import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common'

import { AuthService, LocalAuthGuard, JwtAuthGuard } from '@asmy/auth'
import { YandexAuthGuard } from '@asmy/auth/yandexAuth.guard'

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get('test')
  async test() {
    return { hello: 'world!' }
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/profile')
  getProfile(@Request() req) {
    return req.user
  }

  @Get('auth/yandex')
  yandex(@Query('accessToken') accessToken: string) {
    return this.authService.processYandexAccountLogin(accessToken)
  }

  @Get('auth/vk')
  vk(@Query('code') code: string) {
    return this.authService.processVkAccountLogin({ code })
  }
}
