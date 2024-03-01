import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import PDFService from '@common/services/pdf.service';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';
import { AuctionService } from '../auction.service';

type P = {
  user: UserDocument;
  filter: FilterQuery<Auction>;
};

interface R extends AuctionDocument {}

@Injectable()
export class AcceptAuctionService implements AppServiceI<P, R, HttpException> {
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
    private auctionService: AuctionService,
    private pdfService: PDFService,
  ) {}

  async execute({ user, filter }: P) {
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
      this.pdfService.generatePDF('hola');

      auction.status = AuctionStatusEnum.COMPLETED;
      return Either.makeRight(await this.auctionService.save(auction));
    }
    return Either.makeRight(auction);
  }
}
