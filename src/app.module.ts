import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';

import { DatabaseConfig } from './config/database-config';
import { JWTConfig } from './config/jwt-config';
import { ServerConfig } from './config/server-config';
import { MailerConfig } from './config/mailer-config';

@Module({
  imports: [
    ApiModule,
    CommonModule,
    ConfigModule.forRoot({
      load: [DatabaseConfig, JWTConfig, MailerConfig, ServerConfig],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
