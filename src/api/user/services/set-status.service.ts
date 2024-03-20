import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { StatusEnum } from '@common/enums/status.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { User, UserDocument } from '@database/schemas/user.schema';

type P = {
  filter: FilterQuery<User>;
  status: StatusEnum;
};

type R = UserDocument;

@Injectable()
export class SetStatuService implements AppServiceI<P, R, HttpException> {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private config: ConfigService,
    private mailerService: MailerService,
  ) {}

  async execute({ filter, status }: P) {
    const user = await this.userModel.findOne(filter);
    if (!user) {
      return Either.makeLeft(
        new HttpException('User undefined', HttpStatus.BAD_REQUEST),
      );
    }
    if (status == StatusEnum.active) {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Welcome to Autosensei',
        template: 'account-approved',
        context: {
          url: this.config.get('server.frontUrl'),
          name: user.seller?.firstName || user.dealer?.firstName || user.email,
        },
      });
    }
    return Either.makeRight(await user.save());
  }
}
