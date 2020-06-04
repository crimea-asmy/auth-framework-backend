import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common'
import { ValidationError } from 'class-validator'

import { RegisterDto } from './dtos/register.dto'
import { UserService } from './user.service'

type ParsedErrors = {
  [K: string]: {
    value: any
    property: string
    children: ParsedErrors
    constraints: {
      [K: string]: string
    }
  }
}

const parseValidationErrors = (errors: ValidationError[]): ParsedErrors => {

  const parsedErrors = errors.map(parseValidationError)

  return parsedErrors.reduce((acc, curr) => ({
    ...acc,
    [curr.property]: curr
  }), {} as { [K: string]: any })
}

const parseValidationError = (error: ValidationError) => {
  const parsedChildren = parseValidationErrors(error.children)

  return {
    constraints: error.constraints,
    children: error.children.length ? parsedChildren : undefined,
    property: error.property,
    value: error.value,
  }
}

const exceptionFactory = (errors: ValidationError[]) => {
  return new BadRequestException({
    statusCode: 400,
    validationErrors: parseValidationErrors(errors),
    message: 'Bad Request'
  })
}

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async register(
    @Body(new ValidationPipe({ exceptionFactory }))
    registerDto: RegisterDto,
  ) {
    return this.userService.register(registerDto)
  }
}
