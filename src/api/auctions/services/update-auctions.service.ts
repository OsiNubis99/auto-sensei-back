import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Either } from '@common/generics/Either';
import { IAppService } from '@common/generics/IAppService';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { UpdateAuctionDto } from '../dto/update-auction.dto';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { VehicleDetailsI } from '@database/interfaces/vehicle-details.interface';

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

  async execute({
    _id,
    user,
    vin,
    startDate,
    duration,
    vehicleDetails,
    ...param
  }: P): Promise<Either<R>> {
    const auction = await this.auctionModel.findOne({ _id }).populate('owner');
    if (
      user.type === UserTypeEnum.admin ||
      user._id.equals(auction.owner._id)
    ) {
      if (duration) {
        auction.startDate = startDate;
        auction.duration = duration;
        auction.status = AuctionStatusEnum.unapproved;
      }
      auction.vin = vin;

      for (const key of Object.keys(param)) {
        auction[key] = param[key];
      }

      if (vehicleDetails) {
        const newVehicleDehtails = <VehicleDetailsI>{
          ...auction.vehicleDetails,
        };
        for (const key of Object.keys(vehicleDetails)) {
          newVehicleDehtails[key] = vehicleDetails[key];
        }
        auction.vehicleDetails = newVehicleDehtails;
      }
    } else {
      return Either.makeLeft(
        'This auction is not allowed in your account',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return Either.makeRight(await auction.save());
  }
}
