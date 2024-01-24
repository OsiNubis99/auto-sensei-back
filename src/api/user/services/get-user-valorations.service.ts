import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

interface P {
  user: UserDocument;
}

interface R extends Array<AuctionDocument> {}

@Injectable()
export class GetUserValorationsService
  implements AppServiceI<P, R, HttpException>
{
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
  ) {}

  async execute({ user }: P) {
    return Either.makeRight(
      await this.auctionModel.find({
        'valoration.user': user._id,
      }),
    );
  }
}
