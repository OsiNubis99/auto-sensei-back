import { Module } from '@nestjs/common';

import { DatabaseModule } from '@database/database.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { SocketGateway } from 'src/socket/socket.gateway';

import AWSService from './services/aws.service';
import PDFService from './services/pdf.service';
import StripeService from './services/stripe.service';
import TwilioService from './services/twilio.service';
import VinApiService from './services/vin-api.service';
import VinDecoderService from './services/vin-decoder.service';

const commonServices = [
  AWSService,
  TwilioService,
  PDFService,
  SocketGateway,
  StripeService,
  VinApiService,
  VinDecoderService,
];

@Module({
  imports: [DatabaseModule, MailerModule],
  providers: [...commonServices],
  exports: [...commonServices],
})
export class CommonModule {}
