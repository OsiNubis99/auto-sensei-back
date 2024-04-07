import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { AuctionService } from '../auction.service';

type P = {
  user: UserDocument;
  filter: FilterQuery<Auction>;
};

type R = AuctionDocument;

@Injectable()
export class DropOffAuctionService implements AppServiceI<P, R, HttpException> {
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
    private auctionService: AuctionService,
  ) {}

  async execute({ user, filter }: P) {
    const auction = await this.auctionModel.findOne(filter);
    if (!auction)
      return Either.makeLeft(
        new HttpException('Bad id', HttpStatus.BAD_REQUEST),
      );
    if (!auction.bids[0]?.participant._id.equals(user._id))
      return Either.makeLeft(
        new HttpException('This is not your auction', HttpStatus.UNAUTHORIZED),
      );
    if (auction.status !== AuctionStatusEnum.DROP_OFF) {
      await this.auctionService.makePayment(auction);
      auction.status = AuctionStatusEnum.COMPLETED;
      return Either.makeRight(await this.auctionService.save(auction));
    }
    auction.status = AuctionStatusEnum.DROP_OFF;
    return Either.makeRight(await this.auctionService.save(auction));
  }
}
