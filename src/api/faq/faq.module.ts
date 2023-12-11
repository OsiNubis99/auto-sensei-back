import { CommonModule } from '@common/common.module';
import { Module } from '@nestjs/common';

import { FaqService } from './faq.service';
import { CreateFaqService } from './service/create-faq.service';
import { FaqController } from './faq.controller';
import { UpdateFaqService } from './service/update-faq.service';

@Module({
  imports: [CommonModule],
  controllers: [FaqController],
  providers: [FaqService, CreateFaqService, UpdateFaqService],
})
export class FaqModule {}
