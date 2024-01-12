import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';

import { User, UserDocument } from './user.schema';
import { Auction, AuctionDocument } from './auction.schema';

export type BidDocument = HydratedDocument<Bid>;

@Schema({ timestamps: true })
export class Bid {
  @Prop()
  amount: number;

  @Prop()
  biddingLimit: number;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: Auction.name })
  auction: AuctionDocument;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: User.name })
  participant: UserDocument;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
