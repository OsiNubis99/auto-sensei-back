import { Module } from '@nestjs/common';

import { CommonModule } from '@common/common.module';

import { AddPaymentMethodService } from './services/add-payment-method.service';
import { CreateSessionService } from './services/create-session.service';
import { StripeController } from './stripe.controller';

@Module({
  imports: [CommonModule],
  controllers: [StripeController],
  providers: [AddPaymentMethodService, CreateSessionService],
})
export class StripeModule {}
