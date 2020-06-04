import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from '@asmy/auth'
import { UserModule } from '@asmy/user'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.NODE_ENV !== 'production' ? '10.1.83.148' : 'homepage-postgres',
      username: 'asmy',
      password: 'asmy',
      database: 'homepage',
      synchronize: true,
      dropSchema: true,
      autoLoadEntities: true,
    }),
    AuthModule.register(),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
