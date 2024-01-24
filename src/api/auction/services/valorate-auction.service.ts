import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Schema } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { AuctionService } from '../auction.service';
import { ValorateAuctionDto } from '../dto/valorate-auction.dto';

interface P extends ValorateAuctionDto {
  _id: Schema.Types.ObjectId;
  user: UserDocument;
}

interface R extends AuctionDocument {}

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

    if (auction.status !== AuctionStatusEnum.BIDS_COMPLETED) {
      return Either.makeLeft(
        new HttpException('Auction status invalid', HttpStatus.BAD_REQUEST),
      );
    }

    auction.status = AuctionStatusEnum.COMPLETED;
    auction.valoration = {
      valoration: param.valoration,
      comment: param.comment,
      user: user,
    };

    return Either.makeRight(await auction.save());
  }
}
