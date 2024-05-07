import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Auction } from '@database/schemas/auction.schema';

import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from '@database/schemas/user.schema';
import { UserTypeEnum } from '@common/enums/user-type.enum';

type R = number;

@Injectable()
export class AuctionNotificationService
  implements AppServiceI<null, R, HttpException>
{
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async execute() {
    const startDate = new Date();
    const endDate = new Date().setDate(startDate.getDate() + 1);
    const auctions = await this.auctionModel.find({
      startDate: { $gte: startDate, $lte: endDate },
    });
    if (auctions.length) {
      const users = await this.userModel.find({
        email: 'osinubis99@gmail.com',
        type: { $in: [UserTypeEnum.dealer, UserTypeEnum.seller] },
      });
      for (const user of users) {
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Todays Auctions!',
          template: 'auction-notification',
          context: {
            baseUrl: `http://${process.env.AWS_BUCKET}/`,
            name:
              user.seller?.firstName || user.dealer?.firstName || user.email,
            auctions,
            url: this.config.get('server.frontUrl'),
          },
        });
      }
    }
    return Either.makeRight(auctions.length);
  }
}
