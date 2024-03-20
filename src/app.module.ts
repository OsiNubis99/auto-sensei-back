import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { SocketModule } from './socket/socket.module';

import { AWSConfig } from './config/aws-config';
import { DatabaseConfig } from './config/database-config';
import { DecodedVinConfig } from './config/decoded-vin-config';
import { JWTConfig } from './config/jwt-config';
import { MailerConfig } from './config/mailer-config';
import { ServerConfig } from './config/server-config';
import { StripeConfig } from './config/stripe-api-config';
import { TwilioConfig } from './config/twilio-config';
import { VinApiConfig } from './config/vin-api-config';

@Module({
  imports: [
    ApiModule,
    CommonModule,
    SocketModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [
        AWSConfig,
        DatabaseConfig,
        DecodedVinConfig,
        JWTConfig,
        MailerConfig,
        ServerConfig,
        StripeConfig,
        TwilioConfig,
        VinApiConfig,
      ],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
