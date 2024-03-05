import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Faq, FaqDocument } from '@database/schemas/faq.schema';

import { CreateFaqDto } from '../dto/create-faq.dto';

type P = CreateFaqDto;

type R = FaqDocument;

@Injectable()
export class CreateFaqService implements AppServiceI<P, R, HttpException> {
  constructor(@InjectModel(Faq.name) private faqModel: Model<Faq>) {}

  async execute(param: P) {
    const faq = new this.faqModel(param);
    return Either.makeRight(await faq.save());
  }
}
