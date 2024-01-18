import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Faq } from '@database/schemas/faq.schema';
import { Either } from '@common/generics/either';

String;
@Injectable()
export class FaqService {
  constructor(@InjectModel(Faq.name) private faqModel: Model<Faq>) {}

  async findAll() {
    return Either.makeRight(await this.faqModel.find());
  }

  async findOne(filter: FilterQuery<Faq>) {
    return Either.makeRight(await this.faqModel.findOne(filter));
  }

  async delete(filter: FilterQuery<Faq>) {
    return Either.makeRight(await this.faqModel.deleteOne(filter));
  }
}
