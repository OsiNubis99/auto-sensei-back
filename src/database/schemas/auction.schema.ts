import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { VehicleDetailsI } from '@database/interfaces/vehicle-details.interface';
import { VehicleStatusI } from '@database/interfaces/vehicle-status.interface';
import { User, UserDocument } from './user.schema';
import { BuyNewI } from '@database/interfaces/buy-new.interface';
import { BidI } from '@database/interfaces/bid.interface';

export type AuctionDocument = HydratedDocument<Auction>;

@Schema({ timestamps: true })
export class Auction {
  @Prop({
    enum: AuctionStatusEnum,
    default: AuctionStatusEnum.DRAFT,
  })
  status: AuctionStatusEnum;

  @Prop()
  vin: string;

  @Prop()
  startDate: Date;

  @Prop()
  duration: number;

  @Prop()
  dropOffDate: Date;

  @Prop()
  city: string;

  @Prop()
  province: string;

  @Prop()
  keysNumber: string;

  @Prop()
  vehicleStatus: VehicleStatusI;

  @Prop()
  buyout: number;

  @Prop()
  buyNew: BuyNewI;

  @Prop()
  vehicleDetails: VehicleDetailsI;

  @Prop()
  bids: BidI[];

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: User.name })
  owner: UserDocument;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);

const autoPopulate = function (next) {
  this.populate('owner');
  next();
};

AuctionSchema.pre('findOne', autoPopulate).pre('find', autoPopulate);
