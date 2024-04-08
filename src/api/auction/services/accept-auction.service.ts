import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { AuctionService } from '../auction.service';
import { UrlDto } from '../dto/url.dto';

type P = {
  user: UserDocument;
  filter: FilterQuery<Auction>;
} & UrlDto;

type R = AuctionDocument;

@Injectable()
export class AcceptAuctionService implements AppServiceI<P, R, HttpException> {
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
    private auctionService: AuctionService,
    private mailerService: MailerService,
  ) {}

  async execute({ user, filter, url }: P) {
    const auction = await this.auctionModel.findOne(filter);
    if (!auction)
      return Either.makeLeft(
        new HttpException('Bad id', HttpStatus.BAD_REQUEST),
      );
    if (!auction.owner._id.equals(user._id))
      return Either.makeLeft(
        new HttpException('This is not your auction', HttpStatus.UNAUTHORIZED),
      );
    if (auction.status == AuctionStatusEnum.BIDS_COMPLETED) {
      const payment = await this.auctionService.makePayment(auction);
      if (payment.isRight()) {
        try {
          // await this.mailerService.sendMail({
          //   to: auction.owner.email,
          //   subject: 'Your Auction Has Been Won!',
          //   template: 'auction-won',
          //   context: {
          //     name:
          //       user.seller?.firstName || user.dealer?.firstName || user.email,
          //   },
          // });
          // await this.mailerService.sendMail({
          //   to: auction.bids[0].participant.email,
          //   subject: 'Your Auction Has Been Won!',
          //   template: 'auction-won',
          //   context: {
          //     name:
          //       user.seller?.firstName || user.dealer?.firstName || user.email,
          //   },
          // });
        } catch (err) {
          Logger.log(err);
          return Either.makeLeft(
            new HttpException('Error on mail', HttpStatus.BAD_REQUEST),
          );
        }
      }
      auction.status = AuctionStatusEnum.COMPLETED;
      auction.contractSeallerSing = url;
      await this.auctionService.save(auction);
    }
    return Either.makeRight(auction);
  }
}
