import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Faq, FaqDocument } from '@database/schemas/faq.schema';

String;
@Injectable()
export class FaqService {
  constructor(@InjectModel(Faq.name) private faqModel: Model<Faq>) {}

  async findAll(): Promise<FaqDocument[]> {
    return await this.faqModel.find();
  }

  async findOne(filter: FilterQuery<Faq>): Promise<FaqDocument> {
    return await this.faqModel.findOne(filter);
  }
}
