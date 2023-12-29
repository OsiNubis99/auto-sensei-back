import { Injectable } from '@nestjs/common';
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
    let filter = <FilterQuery<Auction>>{};
    if (user.type == UserTypeEnum.seller) {
      filter = {
        owner: user._id,
      };
    }
    if (user.type == UserTypeEnum.dealer) {
      filter = {
        status: [
          AuctionStatusEnum.upcoming,
          AuctionStatusEnum.live,
          AuctionStatusEnum.completed,
        ],
      };
    }
    return Either.makeRight(
      (await this.auctionModel.find(filter).populate('owner')).map(
        this.calculateStatus,
      ),
    );
  }

  async findOne(filter: FilterQuery<Auction>) {
    return Either.makeRight(
      this.calculateStatus(
        await this.auctionModel.findOne(filter).populate('owner'),
      ),
    );
  }

  calculateStatus(auction: AuctionDocument) {
    if (!auction) return auction;
    if (auction.dropOffDate < new Date()) {
      if (auction.status !== AuctionStatusEnum.live) return auction.toJSON();
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
          return auction.toJSON();
      }
      auction.save();
    }
    return auction.toJSON();
  }

  async setStatus(filter: FilterQuery<Auction>, status: AuctionStatusEnum) {
    return Either.makeRight(
      await this.auctionModel.updateOne(filter, { status }),
    );
  }

  remove(id: number) {
    return Either.makeRight(`This action removes a #${id} auction`);
  }
}
