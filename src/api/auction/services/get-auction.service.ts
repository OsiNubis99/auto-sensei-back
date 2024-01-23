import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { UserTypeEnum } from '@common/enums/user-type.enum';
import { AuctionService } from '../auction.service';
import { FilterAuctionDto } from '../dto/filter-auction.dto';
import { SortAuctionEnum } from '../enum/sort-auction.enum';

interface P extends FilterAuctionDto {
  user: UserDocument;
}

interface R extends Array<AuctionDocument> {}

@Injectable()
export class GetAuctionService implements AppServiceI<P, R, HttpException> {
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
    private auctionService: AuctionService,
  ) {}

  async execute({
    user,
    yearStart,
    yearEnd,
    odometerEnd,
    odometerStart,
    sortBy,
    ...filters
  }: P) {
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
    data = data.map((item) => this.auctionService.calculateStatus(item));
    switch (sortBy) {
      case SortAuctionEnum.date:
        data.sort((a, b) => a.dropOffDate.valueOf() - b.dropOffDate.valueOf());
        break;
      case SortAuctionEnum.year:
        data.sort(
          (a, b) =>
            Number(a?.vehicleDetails.year) - Number(b?.vehicleDetails.year),
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
}
