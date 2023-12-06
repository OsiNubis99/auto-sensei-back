import { Body, Controller, Get, Injectable, Param, Post } from '@nestjs/common';

import { FaqService } from './faq.service';
import { CreateFaqService } from './service/create-faq.service';
import { BasicRequest } from '@common/decorators/basic-request';
import { ApiTags } from '@nestjs/swagger';
import { FaqDocument } from '@database/schemas/faq.schema';
import { CreateFaqDto } from './dto/create-faq.dto';
import { Either } from '@common/generics/Either';

@Injectable()
@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(
    private readonly faqService: FaqService,
    private readonly createFaqService: CreateFaqService,
  ) {}

  @Get('/')
  @BasicRequest<FaqDocument[]>({
    description: 'Create a new user',
    response: 'User Document',
  })
  faq() {
    return this.faqService.findAll();
  }

  @Get('/:id')
  @BasicRequest<FaqDocument>({
    description: 'Create a new user',
    response: 'User Document',
  })
  oneFaq(@Param('id') _id: string) {
    return this.faqService.findOne({ _id });
  }

  @Post('create-faq')
  @BasicRequest<FaqDocument>({
    description: 'Create a new faq',
    response: 'FAQ Document',
  })
  async createFaq(@Body() body: CreateFaqDto): Promise<Either<FaqDocument>> {
    return await this.createFaqService.execute(body);
  }
}
