import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';

import { AWSConfig } from './config/aws-config';
import { DatabaseConfig } from './config/database-config';
import { JWTConfig } from './config/jwt-config';
import { MailerConfig } from './config/mailer-config';
import { ServerConfig } from './config/server-config';
import { TwilioConfig } from './config/twilio-config';
import { VinApiConfig } from './config/vin-api-config';

@Module({
  imports: [
    ApiModule,
    CommonModule,
    ConfigModule.forRoot({
      load: [
        AWSConfig,
        DatabaseConfig,
        JWTConfig,
        MailerConfig,
        ServerConfig,
        TwilioConfig,
        VinApiConfig,
      ],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
