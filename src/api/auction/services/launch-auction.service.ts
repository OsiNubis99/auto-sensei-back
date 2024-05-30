import { HttpException, Injectable } from '@nestjs/common';

import { IdDto } from '@common/dtos/id.dto';
import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';

import { AuctionService } from '../auction.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

type P = IdDto & { clearBids?: boolean };

type R = AuctionDocument;

@Injectable()
export class LaunchAuctionService implements AppServiceI<P, R, HttpException> {
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
    private auctionService: AuctionService,
  ) {}

  async execute({ _id, clearBids }: P) {
    const auction = await this.auctionModel.findOne({
      _id,
      status: {
        $in: [
          AuctionStatusEnum.UPCOMING,
          AuctionStatusEnum.BIDS_COMPLETED,
          AuctionStatusEnum.REJECTED,
        ],
      },
    });

    if (auction) {
      if (clearBids) {
        auction.bids = [];
      }

      auction.status = AuctionStatusEnum.UPCOMING;

      const currentDate = new Date();
      if (currentDate.getUTCHours() > 21) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
      currentDate.setUTCHours(13, 0, 0);

      auction.startDate = currentDate;

      return Either.makeRight(await this.auctionService.save(auction));
    }
  }
}
