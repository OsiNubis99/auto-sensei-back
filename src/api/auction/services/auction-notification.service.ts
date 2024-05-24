import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Auction } from '@database/schemas/auction.schema';
import { User, UserDocument } from '@database/schemas/user.schema';

type P = { user?: UserDocument };

type R = { auctions: number; users: number };

@Injectable()
export class AuctionNotificationService
  implements AppServiceI<P, R, HttpException>
{
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async execute({ user }: P) {
    const startDate = new Date();
    const endDate = new Date().setDate(startDate.getDate() + 1);
    const auctions = await this.auctionModel.find({
      startDate: { $gte: startDate, $lte: endDate },
      status: AuctionStatusEnum.UPCOMING,
    });
    let users = [user];
    if (auctions.length) {
      if (!users.length) {
        users = await this.userModel.find({
          type: UserTypeEnum.dealer,
        });
      }
      for (const user of users) {
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Happy Bidding - AutoSensei',
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
    return Either.makeRight({ auctions: auctions.length, users: users.length });
  }
}
