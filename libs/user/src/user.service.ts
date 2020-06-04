import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { RegisterDto } from './dtos/register.dto'

import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepo.findOne({
      where: { email },
      select: ['email', 'password', 'userId', 'firstName', 'lastName'],
    })
  }

  async register(registerDto: RegisterDto) {
    if (await this.userRepo.findOne({ where: { email: registerDto.email } })) {
      throw new BadRequestException('Пользователь уже существует')
    }

    const newUser = new User()

    newUser.email = registerDto.email
    newUser.password = registerDto.password
    newUser.firstName = registerDto.firstName
    newUser.lastName = registerDto.lastName

    const createdUser = await this.userRepo.save(newUser)

    return createdUser
  }
}
