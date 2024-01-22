import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { Either } from '@common/generics/either';
import { timeToEnd, timeToStart } from '@common/tools/date.functions';
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
        status: { $nin: [AuctionStatusEnum.DELETED] },
      };
    }
    if (user.type == UserTypeEnum.dealer) {
      filter = {
        status: [
          AuctionStatusEnum.UPCOMING,
          AuctionStatusEnum.LIVE,
          AuctionStatusEnum.COMPLETED,
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
    const auction = await this.auctionModel.findOne(filter).populate('owner');
    if (!auction)
      return Either.makeLeft(
        new HttpException('Bad id', HttpStatus.BAD_REQUEST),
      );
    return Either.makeRight(this.calculateStatus(auction));
  }

  calculateStatus(auction: AuctionDocument) {
    if (!auction) return auction;
    if (auction.duration) {
      const started = timeToStart(auction.startDate) < 0;
      if (started) {
        const ended = timeToEnd(auction.startDate, auction.duration) < 0;
        if (!ended && auction.status == AuctionStatusEnum.UPCOMING) {
          auction.status = AuctionStatusEnum.LIVE;
          auction.save();
        }
        if (ended) {
          if (auction.status == AuctionStatusEnum.LIVE) {
            auction.status = AuctionStatusEnum.BIDS_COMPLETED;
            auction.save();
          }
          const drop_off = timeToStart(auction.dropOffDate) < 0;
          if (drop_off && auction.status == AuctionStatusEnum.BIDS_COMPLETED) {
            auction.status = AuctionStatusEnum.DROP_OFF;
            auction.save();
          }
        }
      }
    }
    return auction;
  }

  async aprove(filter: FilterQuery<Auction>) {
    const auction = await this.auctionModel.findOne(filter).populate('owner');
    if (!auction)
      return Either.makeLeft(
        new HttpException('Bad id', HttpStatus.BAD_REQUEST),
      );
    if (auction.status == AuctionStatusEnum.UNAPPROVED) {
      if (auction.startDate) {
        auction.status = AuctionStatusEnum.UPCOMING;
      } else {
        auction.startDate = new Date();
        auction.status = AuctionStatusEnum.LIVE;
      }
      return Either.makeRight(await auction.save());
    }
    return Either.makeLeft(
      new HttpException('Cannot aprove this auction', HttpStatus.BAD_REQUEST),
    );
  }

  async reject(filter: FilterQuery<Auction>) {
    const auction = await this.auctionModel.findOne(filter).populate('owner');
    if (!auction)
      return Either.makeLeft(
        new HttpException('Bad id', HttpStatus.BAD_REQUEST),
      );
    if (auction.status == AuctionStatusEnum.UNAPPROVED) {
      auction.status = AuctionStatusEnum.REJECTED;
      return Either.makeRight(await auction.save());
    }
    return Either.makeLeft(
      new HttpException('Cannot aprove this auction', HttpStatus.BAD_REQUEST),
    );
  }

  async cancel(user: UserDocument, filter: FilterQuery<Auction>) {
    const auction = await this.auctionModel.findOne(filter).populate('owner');
    if (!auction)
      return Either.makeLeft(
        new HttpException('Bad id', HttpStatus.BAD_REQUEST),
      );
    if (!auction.owner._id.equals(user._id))
      return Either.makeLeft(
        new HttpException('This is not your auction', HttpStatus.UNAUTHORIZED),
      );
    auction.status = AuctionStatusEnum.CANCELLED;
    return Either.makeRight(await auction.save());
  }

  async remove(filter: FilterQuery<Auction>) {
    const auction = await this.auctionModel.findOne(filter).populate('owner');
    if (!auction)
      return Either.makeLeft(
        new HttpException('Bad id', HttpStatus.BAD_REQUEST),
      );
    if (!auction.owner._id.equals(user._id))
      return Either.makeLeft(
        new HttpException('This is not your auction', HttpStatus.UNAUTHORIZED),
      );
    auction.status = AuctionStatusEnum.DELETED;
    return Either.makeRight(await auction.save());
  }
}
