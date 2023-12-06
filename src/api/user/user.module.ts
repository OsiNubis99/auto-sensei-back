import { CommonModule } from '@common/common.module';
import { Module } from '@nestjs/common';
import { RegisterUserService } from './services/register-user.service';
import { UpdateUserService } from './services/update-user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  providers: [RegisterUserService, UpdateUserService],
})
export class UserModule {}
