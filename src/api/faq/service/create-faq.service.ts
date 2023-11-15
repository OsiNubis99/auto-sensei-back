import { Faq, FaqDocument } from '@database/schemas/faq.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IAppService } from '@common/generics/IAppService';
import { Either } from '@common/generics/Either';
import { CreateFaqInput } from '../input/create-faq.input';

@Injectable()
export class CreateFaqService
  implements IAppService<CreateFaqInput, FaqDocument>
{
  constructor(@InjectModel(Faq.name) private faqModel: Model<Faq>) {}

  async execute(param: CreateFaqInput): Promise<Either<FaqDocument>> {
    const faq = new this.faqModel(param);
    return Either.makeRight(await faq.save());
  }
}
