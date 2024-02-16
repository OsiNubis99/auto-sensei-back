import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Schema } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { MessageReasonEnum } from '@common/enums/message-reason.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';
import { SocketGateway } from 'src/socket/socket.gateway';

import { AuctionService } from '../auction.service';
import { CreateBidDto } from '../dto/create-bid.dto';

interface P extends CreateBidDto {
  _id: Schema.Types.ObjectId;
  user: UserDocument;
}

interface R extends AuctionDocument {}

@Injectable()
export class CreateBidService implements AppServiceI<P, R, HttpException> {
  private autoBidAmount = 100;

  constructor(
    private auctionService: AuctionService,
    private socket: SocketGateway,
  ) {}

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

    const lastPrice =
      auction.bids[0]?.amount || auction.vehicleDetails.basePrice || 0;

    if (lastPrice >= param.amount) {
      return Either.makeLeft(
        new HttpException('Amount is insufficient', HttpStatus.BAD_REQUEST),
      );
    }

    const lastBid = auction.bids[0];
    auction.bids.unshift({
      amount: param.amount,
      biddingLimit: param.biddingLimit,
      participant: user,
    });
    let userToNotify = lastBid?.participant;

    if (lastBid?.biddingLimit >= param.amount) {
      // Automatic bid
      if (param.biddingLimit >= lastBid.biddingLimit) {
        // Automatic user response
        let userAmount = param.biddingLimit;
        let lastBidAmount = lastBid.biddingLimit;

        if (param.biddingLimit > lastBid.biddingLimit + this.autoBidAmount) {
          userAmount = lastBid.biddingLimit + this.autoBidAmount;
          lastBidAmount = lastBid.biddingLimit;
        }

        auction.bids.unshift({
          amount: lastBidAmount,
          biddingLimit: lastBid.biddingLimit,
          participant: lastBid.participant,
          automatic: true,
        });
        auction.bids.unshift({
          amount: userAmount,
          biddingLimit: param.biddingLimit,
          participant: user,
          automatic: true,
        });
      } else {
        // Automatic user response insufficient
        userToNotify = user;
        const userBigestBid = param.biddingLimit || param.amount;
        let bidAmount = lastBid.biddingLimit;

        if (lastBid.biddingLimit > userBigestBid + this.autoBidAmount) {
          bidAmount = userBigestBid + this.autoBidAmount;
        }

        auction.bids.unshift({
          amount: bidAmount,
          biddingLimit: lastBid.biddingLimit,
          participant: lastBid.participant,
          automatic: true,
        });
      }
    }

    if (userToNotify) {
      this.socket.broadcast({
        userId: userToNotify._id.toString(),
        reason: MessageReasonEnum.bidExceeded,
        message: auction,
      });
    }

    return Either.makeRight(await this.auctionService.save(auction));
  }
}
