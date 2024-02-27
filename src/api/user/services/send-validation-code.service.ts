import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PhoneDto } from '@common/dtos/phone.dto';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { PhoneCode } from '@database/schemas/phone-code.schema';
import TwilioService from '@common/services/twilio.service';

type P = PhoneDto;

type R = string;

@Injectable()
export class SendValidationCodeService
  implements AppServiceI<P, R, HttpException>
{
  constructor(
    @InjectModel(PhoneCode.name)
    private phoneCodeModel: Model<PhoneCode>,
    private twilioService: TwilioService,
  ) {}

  async execute({ phone }: P) {
    const code = Math.floor(100000 + Math.random() * 600000).toString();

    const messageResponse = this.twilioService.sendCodeMessage({ phone, code });
    if (!messageResponse) {
      return Either.makeLeft(
        new HttpException('Send message fail', HttpStatus.BAD_REQUEST),
      );
    }

    const phoneCode = new this.phoneCodeModel({ phone, code });
    phoneCode.save();

    return Either.makeRight('Ok');
  }
}
