import { IsEmail, Length, IsString, Equals } from 'class-validator'

export class RegisterDto {
  @IsEmail({}, { message: 'Некорректная электронная почта' })
  email: string

  @Length(6, 512, {
    message: 'Пароль должен быть от 6 до 512 символов'
  })
  password: string

  @IsString()
  @Length(1, 512, {
    message: 'Длинна имени должна быть от 1 до 512 символов'
  })
  firstName: string

  @IsString()
  @Length(1, 512, {
    message: 'Длинна фамилии должна быть от 1 до 512 символов'
  })
  lastName: string

  @Equals(true, {
    message: 'Необходимо дать согласие на обработку персональных данных'
  })
  personalDataApprove: boolean
}
