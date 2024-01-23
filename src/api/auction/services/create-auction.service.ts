import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import VinApiService from '@common/services/vin-api.service';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { CreateAuctionDto } from '../dto/create-auction.dto';

interface P extends CreateAuctionDto {
  user: UserDocument;
}

interface R extends AuctionDocument {}

@Injectable()
export class CreateAuctionService implements AppServiceI<P, R, HttpException> {
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
    private vinApiService: VinApiService,
  ) {}

  async execute({ user, vin, ...param }: P) {
    const vinResponse = await this.vinApiService.getCarData(vin);
    if (vinResponse.isLeft()) {
      return Either.makeLeft(
        new HttpException(
          vinResponse.getLeft().message,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
    const auction = new this.auctionModel();

    auction.owner = user;
    auction.vin = vin;

    for (const key of Object.keys(param)) {
      auction[key] = param[key];
    }

    auction.status = AuctionStatusEnum.DRAFT;
    auction.vehicleDetails = vinResponse.getRight();

    return Either.makeRight(await auction.save());
  }
}
