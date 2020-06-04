import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import fetch from 'node-fetch'

import { compare } from 'bcryptjs'

import { UserService } from '@asmy/user'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username)

    if (!user) {
      return null
    }

    if (user && (await compare(pass, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async processVkAccountLogin(params: { code: string }) {
    const credentials = await fetch(
      `https://oauth.vk.com/access_token?client_id=6312091&client_secret=rRNRsds103RdVrHqp2ot&redirect_uri=https://aesimonov.ru/auth/vk/callback&code=${params.code}`,
    )

    const parsedCredentials = await credentials.json()

    const results = await fetch(
      `https://api.vk.com/method/users.get?user_ids=${parsedCredentials.user_id}&access_token=${parsedCredentials.access_token}&v=5.107`,
    )

    const response = await results.json()

    if ('response' in response) {

      return {
        firstName: response.response[0].first_name,
        lastName: response.response[0].last_name,
        email: parsedCredentials.email,
      }
    }

    console.log(response)
    console.log(parsedCredentials)

    throw new Error()
  }

  async processYandexAccountLogin(accessToken: string) {
    const results = await fetch('https://login.yandex.ru/info?format=json', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const response: {
      first_name: string
      last_name: string
      display_name: string
      real_name: string
      sex: string
      login: string
      default_email: string
      id: string
      client_id: string
      emails: string[]
    } = await results.json()

    return {
      firstName: response.first_name,
      lastName: response.last_name,
      email: response.default_email,
    }
  }
}
