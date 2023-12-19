import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Either } from '@common/generics/Either';
import { IAppService } from '@common/generics/IAppService';
import { VehicleDetailsI } from '@database/interfaces/vehicle-details.interface';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { UpdateAuctionDto } from '../dto/update-auction.dto';
import { UserTypeEnum } from '@common/enums/user-type.enum';

interface P extends UpdateAuctionDto {
  _id: string;
  user: UserDocument;
}

interface R extends AuctionDocument {}

@Injectable()
export class UpdateAuctionService implements IAppService<P, R> {
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
  ) {}

  async execute({ _id, user, vin, status, ...param }: P): Promise<Either<R>> {
    const auction = await this.auctionModel.findOne({ _id });

    if (user.type == UserTypeEnum.admin || user._id == auction.owner._id) {
      if (user.type == UserTypeEnum.admin) {
        auction.status = status;
      }
      auction.vin = vin;

      for (const key of Object.keys(param)) {
        auction[key] = param[key];
      }
    } else {
      return Either.makeLeft(
        'This auction is not allowed in your account',
        HttpStatus.UNAUTHORIZED,
      );
    }

    auction.owner = user;

    auction.vehicleDetails = <VehicleDetailsI>{
      vin,
      year: 'year',
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