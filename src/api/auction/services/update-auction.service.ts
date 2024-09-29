import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Auction, AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { IdDto } from '@common/dtos/id.dto';
import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { VehicleDetailsI } from '@database/interfaces/vehicle-details.interface';

import { UpdateAuctionDto } from '../dto/update-auction.dto';

type P = IdDto &
  UpdateAuctionDto & {
    user: UserDocument;
  };

type R = AuctionDocument;

@Injectable()
export class UpdateAuctionService implements AppServiceI<P, R, HttpException> {
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
  }: P) {
    const auction = await this.auctionModel.findOne({ _id }).populate('owner');
    if (!auction) {
      return Either.makeLeft(
        new HttpException('Auction not found', HttpStatus.NOT_FOUND),
      );
    }
    if (
      user.type === UserTypeEnum.admin ||
      user._id.equals(auction.owner._id)
    ) {
      if (duration) {
        auction.startDate = startDate;
        auction.duration = duration;
        auction.status = AuctionStatusEnum.UNAPPROVED;
      }
      auction.vin = vin;

      for (const key of Object.keys(param)) {
        auction[key] = param[key];
      }

      if (vehicleDetails) {
        const newVehicleDehtails = <VehicleDetailsI>{
          ...auction.vehicleDetails,
          vin,
        };
        for (const key of Object.keys(vehicleDetails)) {
          newVehicleDehtails[key] = vehicleDetails[key];
        }
        auction.vehicleDetails = newVehicleDehtails;
      }
    } else {
      return Either.makeLeft(
        new HttpException(
          'This auction is not allowed in your account',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    }

    return Either.makeRight(await auction.save());
  }
}
