import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as Schemas } from 'mongoose';

import { User, UserDocument } from '@database/schemas/user.schema';

@Schema({ _id: false })
export class BidI {
  @Prop()
  amount: number;

  @Prop()
  biddingLimit?: number;

  @Prop({ type: Schemas.Types.ObjectId, ref: User.name })
  participant: UserDocument;

  @Prop()
  automatic?: boolean;
}
