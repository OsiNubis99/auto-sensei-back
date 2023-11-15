import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Faq } from '@database/schemas/faq.schema';
import { FaqType } from 'src/graphql/type/faq.type';

String;
@Injectable()
export class FaqService {
  constructor(@InjectModel(Faq.name) private faqModel: Model<Faq>) {}

  async findAll(): Promise<FaqType[]> {
    return await this.faqModel.find();
  }

  async findOne(filter: Partial<FaqType>): Promise<FaqType> {
    return await this.faqModel.findOne(filter);
  }
}
