import { Module } from '@nestjs/common';

import { AuctionsModule } from './auctions/auctions.module';
import { AuthModule } from './auth/auth.module';
import { FaqModule } from './faq/faq.module';
import { UploaderModule } from './uploader/uploader.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuctionsModule, AuthModule, FaqModule, UploaderModule, UserModule],
})
export class ApiModule {}
