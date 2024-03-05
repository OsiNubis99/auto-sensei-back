import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { DealerStatsI } from '../interfaces/dealer-stats.interface';
import { SellerStatsI } from '../interfaces/seller-stats.interface';
import { UserTypeEnum } from '@common/enums/user-type.enum';

type P = {
  user: UserDocument;
};

type R = DealerStatsI | SellerStatsI;

@Injectable()
export class GetUserStatsService implements AppServiceI<P, R, HttpException> {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
  ) {}

  async execute({ user }: P) {
    if (user.type == UserTypeEnum.dealer) {
      const resp: DealerStatsI = {
        total_auciton: 0,
        total_won: 0,
        total_purchase: 0,
        success_rate: '0',
        top: [],
      };
      const won: AuctionDocument[] = [];
      const auctions = await this.auctionModel.find({
        'bids.participant': user._id,
      });
      auctions.forEach((auction) => {
        resp.total_purchase += auction.bids[0].amount;
        if (auction.bids[0].participant._id.equals(user._id)) {
          won.push(auction);
        }
      });
      won.sort((a, b) => a.bids[0].amount - b.bids[0].amount);
      resp.top = won.slice(0, 2);
      resp.total_auciton = auctions.length;
      resp.total_won = won.length;
      resp.success_rate = ((won.length * 100) / auctions.length).toFixed(2);

      return Either.makeRight(resp);
    }
    return Either.makeLeft(
      new HttpException('Bad user type', HttpStatus.BAD_REQUEST),
    );
  }
}
