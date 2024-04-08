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
import { AuctionService } from '../auction.service';

type P = IdDto & { user: UserDocument };

type R = AuctionDocument;

@Injectable()
export class CreateContractService implements AppServiceI<P, R, HttpException> {
  public tax = 300;
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
    private auctionService: AuctionService,
    private pdfService: PDFService,
    private awsService: AWSService,
  ) {}

  async execute({ user, _id }: P) {
    let auction = await this.auctionModel.findById(_id);
    if (!auction || !auction.bids[0]?.participant) {
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

    if (!auction.serial) {
      auction = await this.auctionService.setNextSerial(auction);
    }

    const amount = auction.bids[0]?.amount || 0;

    const doc = await this.pdfService.generatePDF({
      dealer_company_name: auction.bids[0].participant.dealer?.name || 'name',
      address_line_1: auction.bids[0].participant.address?.line1 || 'address',
      address_line_2: auction.bids[0].participant.address?.line2 || 'address',
      city: auction.bids[0].participant.address?.city || 'city',
      state: auction.bids[0].participant.address?.state || 'city',
      postal_code: auction.bids[0].participant.address?.postal_code || 'city',
      car_name: `${auction.vehicleDetails.model} ${auction.vehicleDetails.make}`,
      dealer_phone: auction.bids[0].participant.dealer?.phone || 'name',
      dealer_name: auction.bids[0].participant.dealer?.firstName || 'name',
      seller_name: auction.owner.seller?.firstName || 'name',
      auction_serial: auction.serial?.toString() || '000',
      date: Date.toString(),
      car_year: auction.vehicleDetails.year || '2024',
      car_color: auction.vehicleDetails.color || '',
      car_vin: auction.vin,
      car_km: auction.vehicleDetails.odometer?.toString() || '0',
      car_price: amount.toString(),
      tax: this.tax.toString(),
      total_price: (amount + this.tax).toString(),
    });

    const url = await this.awsService.upload(
      'auction/contract',
      auction.id + '-not-signed.pdf',
      doc,
      'application/pdf',
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
