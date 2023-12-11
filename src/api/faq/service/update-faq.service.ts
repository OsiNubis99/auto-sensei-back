import { Faq, FaqDocument } from '@database/faq.schema';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IAppService } from '@common/generics/IAppService';
import { Either } from '@common/generics/Either';
import { UpdateFaqDto } from '../dto/update-faq.dto';

interface P extends UpdateFaqDto {
  id: string;
}

interface R extends FaqDocument {}

@Injectable()
export class UpdateFaqService implements IAppService<P, R> {
  constructor(@InjectModel(Faq.name) private faqModel: Model<Faq>) {}

  async execute({ id, ...param }: P): Promise<Either<R>> {
    const faq = await this.faqModel.findById(id);
    if (!faq) return Either.makeLeft('Invalid FAQ id', HttpStatus.BAD_REQUEST);

    for (const key of Object.keys(param)) {
      faq[key] = param[key];
    }

    try {
      await this.faqModel.updateOne({ _id: faq._id }, faq);
    } catch (err) {
      return Either.makeLeft('Bad update', HttpStatus.BAD_REQUEST);
    }

    return Either.makeRight(faq);
  }
}
