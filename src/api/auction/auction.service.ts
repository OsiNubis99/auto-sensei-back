import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { Either } from '@common/generics/either';
import { timeToEnd, timeToStart } from '@common/tools/date.functions';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

@Injectable()
export class AuctionService {
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
  ) {}

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

  async accept(user: UserDocument, filter: FilterQuery<Auction>) {
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
      auction.status = AuctionStatusEnum.COMPLETED;
      return Either.makeRight(await auction.save());
    }
    return Either.makeRight(await auction.save());
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
      return Either.makeRight(await auction.save());
    }
    return Either.makeRight(await auction.save());
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
    return Either.makeRight(await auction.save());
  }
}
