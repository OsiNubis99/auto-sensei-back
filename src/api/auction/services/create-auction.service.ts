import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import VinDecoderService from '@common/services/vin-decoder.service';
import { VehicleDetailsI } from '@database/interfaces/vehicle-details.interface';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';
import { CreateAuctionDto } from '../dto/create-auction.dto';

type P = CreateAuctionDto & {
  user: UserDocument;
};

type R = AuctionDocument;

@Injectable()
export class CreateAuctionService implements AppServiceI<P, R, HttpException> {
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
    private vinApiService: VinDecoderService,
  ) {}

  async execute({ user, vin, ...param }: P) {
    // const vinResponse = await this.vinApiService.getCarData(vin);
    // if (vinResponse.isLeft()) {
    //   return Either.makeLeft(
    //     new HttpException(
    //       vinResponse.getLeft().message,
    //       HttpStatus.BAD_REQUEST,
    //     ),
    //   );
    // }
    const auction = new this.auctionModel();

    auction.owner = user;
    auction.vin = vin;

    for (const key of Object.keys(param)) {
      auction[key] = param[key];
    }

    auction.status = AuctionStatusEnum.DRAFT;
    // auction.vehicleDetails = vinResponse.getRight();
    auction.vehicleDetails = <VehicleDetailsI>{
      vin,
    };

    return Either.makeRight(await auction.save());
  }
}
