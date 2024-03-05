import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IdDto } from '@common/dtos/id.dto';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

type P = IdDto & {
  user: UserDocument;
};

type R = AuctionDocument;

@Injectable()
export class AddAuctionRemindService
  implements AppServiceI<P, R, HttpException>
{
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
  ) {}

  async execute({ user, _id }: P) {
    const auction = await this.auctionModel.findOne({ _id });

    if (!auction) {
      return Either.makeLeft(
        new HttpException('Id invalid', HttpStatus.BAD_REQUEST),
      );
    }

    if (!auction.remindList) auction.remindList = [];

    const userIndexOnList = auction.remindList.findIndex((item) =>
      user._id.equals(item._id),
    );

    if (userIndexOnList >= 0) {
      return Either.makeRight(auction);
    }

    auction.remindList.push(user);

    return Either.makeRight(await auction.save());
  }
}
