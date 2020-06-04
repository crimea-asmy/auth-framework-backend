import { Strategy } from 'passport-yandex'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: '473eb59dc00e42278e401acfa6d41e8f',
      clientSecret: 'f3eae6a0f73f4051b4a89a7c841672ef',
      callbackURL: "https://aesimonov.ru/auth/yandex/callback"
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: { id: string }) {
    return { accessToken, refreshToken, profile }
  }
}
