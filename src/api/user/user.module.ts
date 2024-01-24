import { CommonModule } from '@common/common.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from '@auth/auth.service';
import { GetUserValorationsService } from './services/get-user-valorations.service';
import { RegisterUserService } from './services/register-user.service';
import { UpdateUserService } from './services/update-user.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    CommonModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    AuthService,
    GetUserValorationsService,
    UserService,
    RegisterUserService,
    UpdateUserService,
  ],
})
export class UserModule {}
