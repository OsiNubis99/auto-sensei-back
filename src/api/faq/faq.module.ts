import { CommonModule } from '@common/common.module';
import { Module } from '@nestjs/common';

import { FaqService } from './faq.service';
import { CreateFaqService } from './service/create-faq.service';
import { FaqController } from './faq.controller';

@Module({
  imports: [CommonModule],
  providers: [FaqService, CreateFaqService],
  controllers: [FaqController],
})
export class FaqModule {}
