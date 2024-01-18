import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Either } from '@common/generics/either';
import { AppServiceI } from '@common/generics/app-service.interface';
import { VehicleDetailsI } from '@database/interfaces/vehicle-details.interface';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { CreateAuctionDto } from '../dto/create-auction.dto';
import { AuctionStatusEnum } from '@common/enums/auction-status.enum';

interface P extends CreateAuctionDto {
  user: UserDocument;
}

interface R extends AuctionDocument {}

@Injectable()
export class CreateAuctionService implements AppServiceI<P, R, HttpException> {
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
  ) {}

  async execute({ user, vin, ...param }: P) {
    const auction = new this.auctionModel();

    auction.owner = user;
    auction.vin = vin;

    for (const key of Object.keys(param)) {
      auction[key] = param[key];
    }

    auction.status = AuctionStatusEnum.draft;

    auction.vehicleDetails = <VehicleDetailsI>{
      vin,
      year: new Date(),
      make: 'make',
      model: 'model',
      series: 'series',
      bodyType: 'bodyType',
      cylinder: 'cylinder',
      transmission: 'transmission',
    };

    return Either.makeRight(await auction.save());
  }
}
