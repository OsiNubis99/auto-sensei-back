import { Injectable } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { FaqType } from 'src/graphql/type/faq.type';
import { CreateFaqInput } from './input/create-faq.input';
import { FaqService } from './faq.service';
import { CreateFaqService } from './service/create-faq.service';
import { BasicRequest } from '@common/decorators/basic-request';

@Injectable()
@Resolver(() => FaqType)
export class FaqResolver {
  constructor(
    private readonly faqService: FaqService,
    private readonly createFaqService: CreateFaqService,
  ) {}

  @Query(() => [FaqType])
  faq() {
    return this.faqService.findAll();
  }

  @Query(() => FaqType)
  oneFaq(@Args('id') _id: string) {
    return this.faqService.findOne({ _id });
  }

  @Mutation(() => FaqType)
  @BasicRequest<FaqType>()
  async createFaq(@Args('input') input: CreateFaqInput) {
    return await this.createFaqService.execute(input);
  }
}
