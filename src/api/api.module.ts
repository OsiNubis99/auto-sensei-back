import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { FaqModule } from './faq/faq.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, FaqModule, UserModule],
})
export class ApiModule {}
