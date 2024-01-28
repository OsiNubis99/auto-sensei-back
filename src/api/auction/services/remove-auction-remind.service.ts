import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';

import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

interface P {
  _id: Schema.Types.ObjectId;
  user: UserDocument;
}

interface R extends AuctionDocument {}

@Injectable()
export class RemoveAuctionRemindService
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

    const userIndexOnList = auction.remindList.findIndex((item) =>
      user._id.equals(item._id),
    );

    if (userIndexOnList < 0) {
      return Either.makeRight(auction);
    }

    auction.remindList.splice(userIndexOnList, 1);

    return Either.makeRight(await auction.save());
  }
}
