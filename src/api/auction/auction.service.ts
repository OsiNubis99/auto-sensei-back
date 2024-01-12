import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { Either } from '@common/generics/Either';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';
import { FilterAuctionDto } from './dto/filter-auction.dto';
import { SortAuctionEnum } from './enum/sort-auction.enum';

@Injectable()
export class AuctionService {
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
  ) {}

  async findAll(
    user: UserDocument,
    {
      yearStart,
      yearEnd,
      odometerEnd,
      odometerStart,
      sortBy,
      ...filters
    }: FilterAuctionDto,
  ) {
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
    for (const key of Object.keys(filters)) {
      if (!filter.vehicleDetails) filter.vehicleDetails = {};
      filter.vehicleDetails[key] = filters[key];
    }
    if (yearStart) {
      if (!filter.vehicleDetails) filter.vehicleDetails = {};
      filter.vehicleDetails.year = { $gte: yearStart };
    }
    if (yearEnd) {
      if (!filter.vehicleDetails) filter.vehicleDetails = {};
      filter.vehicleDetails.year = { $lte: yearEnd };
    }
    if (odometerStart) {
      if (!filter.vehicleDetails) filter.vehicleDetails = {};
      filter.vehicleDetails.odometer = { $gte: odometerStart };
    }
    if (odometerEnd) {
      if (!filter.vehicleDetails) filter.vehicleDetails = {};
      filter.vehicleDetails.odometer = { $lte: odometerEnd };
    }

    let data = await this.auctionModel.find(filter).populate('owner');
    data = data.map((item) => this.calculateStatus(item));
    switch (sortBy) {
      case SortAuctionEnum.date:
        data.sort((a, b) => a.dropOffDate.valueOf() - b.dropOffDate.valueOf());
        break;
      case SortAuctionEnum.year:
        data.sort(
          (a, b) =>
            a?.vehicleDetails.year.valueOf() - b?.vehicleDetails.year.valueOf(),
        );
        break;
      case SortAuctionEnum.odometer:
        data.sort(
          (a, b) => a?.vehicleDetails.odometer - b?.vehicleDetails.odometer,
        );
        break;
    }
    return Either.makeRight(data);
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

  async setStatus(filter: FilterQuery<Auction>, status: AuctionStatusEnum) {
    return Either.makeRight(
      await this.auctionModel.updateOne(filter, { status }),
    );
  }

  remove(id: number) {
    return Either.makeRight(`This action removes a #${id} auction`);
  }
}
