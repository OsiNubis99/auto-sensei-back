import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';

import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { BidI } from '@database/interfaces/bid.interface';
import { BuyNewI } from '@database/interfaces/buy-new.interface';
import { ValorationI } from '@database/interfaces/valoration.interface';
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
  buyNew: BuyNewI;

  @Prop()
  vehicleDetails: VehicleDetailsI;

  @Prop({ type: SchemaFactory.createForClass(ValorationI) })
  valoration: ValorationI;

  @Prop({ type: [SchemaFactory.createForClass(BidI)] })
  bids: BidI[];

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: User.name })
  owner: UserDocument;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);

const autoPopulate = function (next: () => void) {
  this.populate('owner');
  this.populate({ path: 'bids', populate: 'participant' });
  this.populate({ path: 'valoration', populate: 'user' });
  next();
};

AuctionSchema.pre('findOne', autoPopulate).pre('find', autoPopulate);
