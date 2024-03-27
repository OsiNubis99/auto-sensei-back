import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { IdDto } from '@common/dtos/id.dto';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import AWSService from '@common/services/aws.service';
import PDFService from '@common/services/pdf.service';

type P = IdDto & { user: UserDocument };

type R = AuctionDocument;

@Injectable()
export class CreateContractService implements AppServiceI<P, R, HttpException> {
  public tax = 300;
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
    private pdfService: PDFService,
    private awsService: AWSService,
  ) {}

  async execute({ user, _id }: P) {
    const auction = await this.auctionModel.findById(_id);
    if (!auction) {
      return Either.makeLeft(
        new HttpException('Id auction is invalid', HttpStatus.BAD_REQUEST),
      );
    }
    if (auction.contract && user.type !== UserTypeEnum.admin) {
      return Either.makeLeft(
        new HttpException(
          'Auction has already an contract',
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const doc = await this.pdfService.generatePDF({
      car_id: auction.id,
      car_name: `${auction.vehicleDetails.model} ${auction.vehicleDetails.make} ${auction.vehicleDetails.year}`,
      car_price: auction.bids[0].amount.toString(),
      car_serial: auction.vin,
      tax: this.tax.toString(),
      total_price: (auction.bids[0].amount + this.tax).toString(),
      dealer_company_name: 'name?',
      address_line_1: '',
      address_line_2: '',
    });

    const url = await this.awsService.upload(
      'auction/contract',
      auction.id + '-not-signed.pdf',
      doc,
    );

    if (url.isLeft()) {
      return Either.makeLeft(
        new HttpException(url.getLeft(), HttpStatus.BAD_REQUEST),
      );
    }
    auction.contract = url.getRight();

    return Either.makeRight(await auction.save());
  }
}