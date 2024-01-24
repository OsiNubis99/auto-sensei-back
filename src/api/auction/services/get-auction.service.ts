import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { AuctionService } from '../auction.service';
import { FilterAuctionDto } from '../dto/filter-auction.dto';

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

  async execute({ user, sortBy, ...filters }: P) {
    let filter: FilterQuery<Auction> = {};
    if (user.type == UserTypeEnum.seller) {
      filter = {
        owner: user._id,
        status: { $nin: [AuctionStatusEnum.DELETED] },
      };
    }
    if (user.type == UserTypeEnum.dealer) {
      filter = {
        $or: [
          {
            status: {
              $in: [AuctionStatusEnum.UPCOMING, AuctionStatusEnum.LIVE],
              $nin: [AuctionStatusEnum.DELETED, AuctionStatusEnum.REJECTED],
            },
          },
          {
            'bids.participant': user._id,
          },
          {
            'valuation.user': user._id,
          },
        ],
      };
    }

    for (const key of Object.keys(filters)) {
      switch (key) {
        case 'color':
          filter['vehicleDetails.color'] = { $in: filters.color };
          break;
        case 'yearStart':
          filter['vehicleDetails.year'] = { $gte: filters.yearStart };
          break;
        case 'yearEnd':
          filter['vehicleDetails.year'] = { $lte: filters.yearEnd };
          break;
        case 'odometerStart':
          filter['vehicleDetails.odometer'] = { $gte: filters.odometerStart };
          break;
        case 'odometerEnd':
          filter['vehicleDetails.odometer'] = { $lte: filters.odometerEnd };
          break;
        default:
          filter['vehicleDetails.' + key] = filters[key];
      }
    }

    let data = await this.auctionModel
      .find(filter)
      .sort(sortBy)
      .populate('owner');
    data = data.map((item) => this.auctionService.calculateStatus(item));
    return Either.makeRight(data);
  }
}
