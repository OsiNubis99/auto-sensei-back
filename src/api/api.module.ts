import { Module } from '@nestjs/common';

import { AuctionsModule } from './auction/auction.module';
import { AuthModule } from './auth/auth.module';
import { FaqModule } from './faq/faq.module';
import { UploaderModule } from './uploader/uploader.module';
import { UserModule } from './user/user.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    AuctionsModule,
    AuthModule,
    FaqModule,
    UploaderModule,
    UserModule,
    StripeModule,
  ],
})
export class ApiModule {}
