import { Module } from '@nestjs/common';

import { DatabaseModule } from '@database/database.module';
import { MailerModule } from 'src/mailer/mailer.module';

import AWSService from './aws/service';
import TwilioService from './twilio/service';

const commonServices = [AWSService, TwilioService];

@Module({
  imports: [DatabaseModule, MailerModule],
  providers: [...commonServices],
  exports: [...commonServices],
})
export class CommonModule {}
