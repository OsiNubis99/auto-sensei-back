import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { FilterQuery, Model } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { MessageReasonEnum } from '@common/enums/message-reason.enum';
import { Either } from '@common/generics/either';
import { timeToEnd, timeToStart } from '@common/tools/date.functions';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class AuctionService {
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
    private socket: SocketGateway,
  ) {}

  calculateStatus(auction: AuctionDocument) {
    if (!auction) return auction;
    let edited = false;
    if (auction.duration) {
      const started = timeToStart(auction.startDate) < 0;
      if (started) {
        const ended = timeToEnd(auction.startDate, auction.duration) < 0;
        if (!ended && auction.status == AuctionStatusEnum.UPCOMING) {
          auction.status = AuctionStatusEnum.LIVE;
          edited = true;
          this.notifySubscribedUsers(auction);
        }
        if (ended) {
          if (auction.status == AuctionStatusEnum.LIVE) {
            if (auction.bids.length > 0) {
              auction.status = AuctionStatusEnum.BIDS_COMPLETED;
              edited = true;
              this.socket.broadcast({
                userId: auction.bids[0].participant._id.toString(),
                reason: MessageReasonEnum.bidsFinished,
                message: auction,
              });
            } else {
              auction.status = AuctionStatusEnum.REJECTED;
              edited = true;
            }
          }
        }
      }
    }
    if (edited) {
      this.save(auction);
    }
    return auction;
  }

  async save(auction: AuctionDocument) {
    this.socket.broadcast({
      reason: MessageReasonEnum.auctionUpdate,
      message: auction,
    });
    return auction.save();
  }

  async notifySubscribedUsers(auction: AuctionDocument) {
    for (const user of auction.remindList) {
      this.socket.broadcast({
        userId: user._id.toString(),
        reason: MessageReasonEnum.subscribedAuctionStarted,
        message: auction,
      });
    }
  }

  @Cron('1 0,30 * * * *')
  async find() {
    const auction = await this.auctionModel.find({
      status: { $in: [AuctionStatusEnum.UPCOMING, AuctionStatusEnum.LIVE] },
    });
    return Either.makeRight(auction.map((item) => this.calculateStatus(item)));
  }

  async findOne(filter: FilterQuery<Auction>) {
    const auction = await this.auctionModel.findOne(filter);
    if (!auction)
      return Either.makeLeft(
        new HttpException('Bad id', HttpStatus.BAD_REQUEST),
      );
    return Either.makeRight(this.calculateStatus(auction));
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
        this.notifySubscribedUsers(auction);
      }
      return Either.makeRight(await this.save(auction));
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
      return Either.makeRight(await this.save(auction));
    }
    return Either.makeLeft(
      new HttpException('Cannot aprove this auction', HttpStatus.BAD_REQUEST),
    );
  }

  async decline(user: UserDocument, filter: FilterQuery<Auction>) {
    const auction = await this.auctionModel.findOne(filter).populate('owner');
    if (!auction)
      return Either.makeLeft(
        new HttpException('Bad id', HttpStatus.BAD_REQUEST),
      );
    if (!auction.owner._id.equals(user._id))
      return Either.makeLeft(
        new HttpException('This is not your auction', HttpStatus.UNAUTHORIZED),
      );
    if (auction.status == AuctionStatusEnum.BIDS_COMPLETED) {
      auction.status = AuctionStatusEnum.DECLINED;
      return Either.makeRight(await this.save(auction));
    }
    return Either.makeRight(auction);
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
    return Either.makeRight(await this.save(auction));
  }

  async dropOff(user: UserDocument, filter: FilterQuery<Auction>) {
    const auction = await this.auctionModel.findOne(filter).populate('owner');
    if (!auction)
      return Either.makeLeft(
        new HttpException('Bad id', HttpStatus.BAD_REQUEST),
      );
    if (!auction.bids[0]?.participant._id.equals(user._id))
      return Either.makeLeft(
        new HttpException('This is not your auction', HttpStatus.UNAUTHORIZED),
      );
    auction.status = AuctionStatusEnum.DROP_OFF;
    return Either.makeRight(await this.save(auction));
  }

  async remove(user: UserDocument, filter: FilterQuery<Auction>) {
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
    return Either.makeRight(await this.save(auction));
  }
}
