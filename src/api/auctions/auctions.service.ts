import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { Either } from '@common/generics/Either';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
  ) {}

  async findAll(user: UserDocument) {
    const filter: Array<FilterQuery<Auction>> = [];
    if (user.type == UserTypeEnum.seller) {
      filter.push({
        owner: user._id,
      });
    }
    if (user.type == UserTypeEnum.dealer) {
      filter.push({ status: AuctionStatusEnum.upcoming });
      filter.push({ status: AuctionStatusEnum.live });
      filter.push({ status: AuctionStatusEnum.completed }); // solo las que participo
    }
    return Either.makeRight(
      (
        await this.auctionModel.find({
          $or: filter,
        })
      ).map((auction: AuctionDocument) => this.calculateStatus(auction)),
    );
  }

  async findOne(filter: FilterQuery<Auction>) {
    return Either.makeRight(
      this.calculateStatus(await this.auctionModel.findOne(filter)),
    );
  }

  async calculateStatus(auction: AuctionDocument) {
    Logger.log(auction);
    return auction;
    if (!auction) return auction;
    if (auction.dropOffDate < new Date()) {
      if (auction.status !== AuctionStatusEnum.live) return auction;
      auction.status = AuctionStatusEnum.completed;
      auction.save();
    } else if (auction.startDate < new Date()) {
      switch (auction.status) {
        case AuctionStatusEnum.upcoming:
          auction.status = AuctionStatusEnum.live;
          break;
        case AuctionStatusEnum.draft:
        case AuctionStatusEnum.unapproved:
          auction.status = AuctionStatusEnum.canceled;
          break;
        default:
          return auction;
      }
      auction.save();
    }
    return auction;
  }

  remove(id: number) {
    return Either.makeRight(`This action removes a #${id} auction`);
  }
}
