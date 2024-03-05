import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { IdDto } from '@common/dtos/id.dto';
import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { AuctionService } from '../auction.service';
import { UpdateBidDto } from '../dto/update-bid.dto';

type P = IdDto &
  UpdateBidDto & {
    user: UserDocument;
  };

type R = AuctionDocument;

@Injectable()
export class UpdateBidService implements AppServiceI<P, R, HttpException> {
  constructor(private auctionService: AuctionService) {}

  async execute({ _id, user, ...param }: P) {
    const auctionSearch = await this.auctionService.findOne({ _id });
    if (auctionSearch.isLeft()) {
      return auctionSearch;
    }
    const auction = auctionSearch.getRight();

    if (auction.status !== AuctionStatusEnum.LIVE) {
      return Either.makeLeft(
        new HttpException('Auction status invalid', HttpStatus.BAD_REQUEST),
      );
    }

    if (!auction.bids[0] || !user._id.equals(auction.bids[0].participant._id)) {
      return Either.makeLeft(
        new HttpException('Auction last bid invalid', HttpStatus.BAD_REQUEST),
      );
    }

    auction.bids[0].biddingLimit = param.biddingLimit;

    return Either.makeRight(await auction.save());
  }
}
