import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { AuctionService } from '../auction.service';
import { UrlDto } from '../dto/url.dto';
import axios from 'axios';

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
    private config: ConfigService,
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
        axios({
          method: 'get',
          url: `http://${process.env.AWS_BUCKET}/${url}`,
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: '0',
          },
          responseType: 'arraybuffer',
        })
          .then(async (resp) => {
            await this.mailerService
              .sendMail({
                to: auction.bids[0].participant.email,
                subject: 'Your Auction Has Been Won!',
                template: 'auction-accept-dealer',
                attachments: [{ content: resp.data, filename: 'contract.pdf' }],
                context: {
                  dealerName: auction.bids[0].participant?.dealer?.name,
                  dropOff: auction.dropOffDate.toLocaleString(),
                  auctionNumber: auction.serial,
                  sellerName: auction.owner?.seller?.firstName,
                  sellerPhone: auction.owner?.seller?.phone,
                  url: this.config.get('server.frontUrl'),
                },
              })
              .catch((err) => {
                Logger.log(err);
              });
            const dealerAddress = [
              auction.bids[0].participant?.address.line1,
              auction.bids[0].participant?.address.city,
              auction.bids[0].participant?.address.state,
              auction.bids[0].participant?.address.postal_code,
            ].join(', ');
            await this.mailerService
              .sendMail({
                to: auction.owner.email,
                subject: 'Congratulations on selling your car!',
                template: 'auction-accept-seller',
                attachments: [{ content: resp.data, filename: 'contract.pdf' }],
                context: {
                  sellerName: auction.owner?.seller?.firstName,
                  dropOff: auction.dropOffDate.toLocaleString(),
                  dealerName: auction.bids[0].participant?.dealer?.name,
                  dealerPhone: auction.bids[0].participant?.dealer?.phone,
                  dealerEmail: auction.bids[0].participant?.email,
                  dealerAddress,
                  url: this.config.get('server.frontUrl'),
                },
              })
              .catch((err) => {
                Logger.log(err);
              });
          })
          .catch((err) => {
            Logger.log(err);
          });
      } else {
        Logger.log(payment.getLeft());
      }
      auction.status = AuctionStatusEnum.COMPLETED;
      auction.contractSeallerSing = url;
      await this.auctionService.save(auction);
    }
    return Either.makeRight(auction);
  }
}
