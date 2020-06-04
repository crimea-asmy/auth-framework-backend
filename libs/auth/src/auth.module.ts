import { Module, DynamicModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@asmy/user';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({})
export class AuthModule {
  static register(): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
          secret: 'awesome-secret',
          signOptions: { expiresIn: '60h' },
        }),
      ],
      exports: [AuthService],
      providers: [AuthService, LocalStrategy, JwtStrategy],
    };
  }
}
