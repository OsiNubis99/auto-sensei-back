import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FaqModule } from './faq/faq.module';

@Module({
  imports: [AuthModule, UserModule, FaqModule],
})
export class ApiModule {}
