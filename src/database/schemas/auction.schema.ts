import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';

import { VehicleDetailsI } from '@database/interfaces/vehicle-details.interface';
import { User, UserDocument } from './user.schema';
import { AuctionStatusEnum } from '@common/enums/auction-status.enum';

export type AuctionDocument = HydratedDocument<Auction>;

@Schema({ timestamps: true })
export class Auction {
  @Prop({
    enum: AuctionStatusEnum,
    default: AuctionStatusEnum.draft,
  })
  status: AuctionStatusEnum;

  @Prop()
  vin: string;

  @Prop()
  startDate: Date;

  @Prop()
  dropOffDate: Date;

  @Prop()
  city: string;

  @Prop()
  province: string;

  @Prop()
  keysNumber: string;

  @Prop()
  vehicleStatus: string;

  @Prop()
  buyout: string;

  @Prop()
  buyNew: string;

  @Prop()
  vehicleDetails: VehicleDetailsI;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: User.name })
  owner: UserDocument;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
