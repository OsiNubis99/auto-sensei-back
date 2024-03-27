import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { BidI } from '@database/interfaces/bid.interface';
import { BuyNewI } from '@database/interfaces/buy-new.interface';
import { ValuationI } from '@database/interfaces/valuation.interface';
import { VehicleDetailsI } from '@database/interfaces/vehicle-details.interface';
import { VehicleStatusI } from '@database/interfaces/vehicle-status.interface';
import { User, UserDocument } from './user.schema';

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
  contract: string;

  @Prop()
  buyNew: BuyNewI;

  @Prop()
  vehicleDetails: VehicleDetailsI;

  @Prop({ type: [mongooseSchema.Types.ObjectId], ref: User.name })
  remindList: UserDocument[];

  @Prop({ type: SchemaFactory.createForClass(ValuationI) })
  valuation: ValuationI;

  @Prop({ type: [SchemaFactory.createForClass(BidI)] })
  bids: BidI[];

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: User.name })
  owner: UserDocument;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);

const autoPopulate = function (next: () => void) {
  this.populate('owner');
  this.populate('remindList');
  this.populate('bids.participant');
  this.populate('bids.paymentMethod');
  this.populate('valuation.user');
  next();
};

AuctionSchema.pre('findOne', autoPopulate).pre('find', autoPopulate);
