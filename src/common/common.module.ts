import { Module } from '@nestjs/common';

import { DatabaseModule } from '@database/database.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [DatabaseModule, MailerModule],
})
export class CommonModule {}
