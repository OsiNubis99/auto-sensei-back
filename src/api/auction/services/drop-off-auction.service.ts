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
import axios from 'axios';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

type P = {
  user: UserDocument;
  filter: FilterQuery<Auction>;
} & UrlDto;

type R = AuctionDocument;

@Injectable()
export class DropOffAuctionService implements AppServiceI<P, R, HttpException> {
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
    if (!auction.bids[0]?.participant._id.equals(user._id))
      return Either.makeLeft(
        new HttpException('This is not your auction', HttpStatus.UNAUTHORIZED),
      );
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
        await this.mailerService.sendMail({
          to: auction.bids[0].participant.email,
          subject:
            'Your Vehicle Auction Transaction Is Complete with AutoSensei!',
          template: 'drop-off-notification',
          attachments: [{ content: resp.data, filename: 'contract.pdf' }],
          context: {
            name: auction.bids[0].participant?.dealer?.name,
            url: this.config.get('server.frontUrl'),
          },
        });
        await this.mailerService.sendMail({
          to: auction.owner.email,
          subject:
            'Your Vehicle Auction Transaction Is Complete with AutoSensei!',
          template: 'drop-off-notification',
          attachments: [{ content: resp.data, filename: 'contract.pdf' }],
          context: {
            name: auction.owner?.seller?.firstName,
            url: this.config.get('server.frontUrl'),
          },
        });
      })
      .catch((err) => {
        Logger.log(err);
      });
    auction.status = AuctionStatusEnum.DROP_OFF;
    auction.contractDealerSing = url;
    return Either.makeRight(await this.auctionService.save(auction));
  }
}
