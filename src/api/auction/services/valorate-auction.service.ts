import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { IdDto } from '@common/dtos/id.dto';
import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { AuctionService } from '../auction.service';
import { ValorateAuctionDto } from '../dto/valorate-auction.dto';

type P = IdDto &
  ValorateAuctionDto & {
    user: UserDocument;
  };

type R = AuctionDocument;

@Injectable()
export class ValorateAuctionService
  implements AppServiceI<P, R, HttpException>
{
  constructor(private auctionService: AuctionService) {}

  async execute({ _id, user, ...param }: P) {
    const auctionSearch = await this.auctionService.findOne({ _id });

    if (auctionSearch.isLeft()) {
      return auctionSearch;
    }
    const auction = auctionSearch.getRight();

    if (!auction.owner._id.equals(user._id)) {
      return Either.makeLeft(
        new HttpException('This is not your auction', HttpStatus.UNAUTHORIZED),
      );
    }

    if (auction.status !== AuctionStatusEnum.DROP_OFF) {
      return Either.makeLeft(
        new HttpException('Auction status invalid', HttpStatus.BAD_REQUEST),
      );
    }

    if (!auction?.bids[0]) {
      return Either.makeLeft(
        new HttpException('Auction bids invalid', HttpStatus.BAD_REQUEST),
      );
    }

    auction.status = AuctionStatusEnum.REVIEWED;
    auction.valuation = {
      valoration: param.valoration,
      comment: param.comment,
      user: auction.bids[0].participant,
    };

    return Either.makeRight(await this.auctionService.save(auction));
  }
}
