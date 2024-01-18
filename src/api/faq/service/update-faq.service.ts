import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';

import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Faq, FaqDocument } from '@database/schemas/faq.schema';

import { UpdateFaqDto } from '../dto/update-faq.dto';

interface P extends UpdateFaqDto {
  _id: Schema.Types.ObjectId;
}

interface R extends FaqDocument {}

@Injectable()
export class UpdateFaqService implements AppServiceI<P, R, HttpException> {
  constructor(@InjectModel(Faq.name) private faqModel: Model<Faq>) {}

  async execute({ _id, ...param }: P) {
    const faq = await this.faqModel.findById(_id);
    if (!faq)
      return Either.makeLeft(
        new HttpException('Invalid FAQ id', HttpStatus.BAD_REQUEST),
      );

    for (const key of Object.keys(param)) {
      faq[key] = param[key];
    }

    return Either.makeRight(await faq.save());
  }
}
