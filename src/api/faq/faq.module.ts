import { CommonModule } from '@common/common.module';
import { Module } from '@nestjs/common';

import { FaqResolver } from './faq.controller';
import { FaqService } from './faq.service';
import { CreateFaqService } from './service/create-faq.service';

@Module({
  imports: [CommonModule],
  providers: [FaqResolver, FaqService, CreateFaqService],
})
export class FaqModule {}
