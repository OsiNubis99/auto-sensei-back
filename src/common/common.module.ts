import { Module } from '@nestjs/common';

import { DatabaseModule } from '@database/database.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { SocketGateway } from 'src/socket/socket.gateway';

import AWSService from './services/aws.service';
import StripeService from './services/stripe.service';
import TwilioService from './services/twilio.service';
import VinApiService from './services/vin-api.service';

const commonServices = [
  AWSService,
  StripeService,
  TwilioService,
  SocketGateway,
  VinApiService,
];

@Module({
  imports: [DatabaseModule, MailerModule],
  providers: [...commonServices],
  exports: [...commonServices],
})
export class CommonModule {}
