import { Faq, FaqDocument } from '@database/faq.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IAppService } from '@common/generics/IAppService';
import { Either } from '@common/generics/Either';
import { CreateFaqDto } from '../dto/create-faq.dto';

interface P extends CreateFaqDto {}

interface R extends FaqDocument {}

@Injectable()
export class CreateFaqService implements IAppService<P, R> {
  constructor(@InjectModel(Faq.name) private faqModel: Model<Faq>) {}

  async execute(param: P): Promise<Either<R>> {
    const faq = new this.faqModel(param);
    return Either.makeRight(await faq.save());
  }
}
