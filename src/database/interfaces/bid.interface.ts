import { Prop } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

import { User, UserDocument } from '@database/schemas/user.schema';

export class BidI {
  @Prop()
  amount: number;

  @Prop()
  biddingLimit?: number;

  @Prop({ type: Schema.Types.ObjectId, ref: User.name })
  participant: UserDocument;

  @Prop()
  automatic?: boolean;
}
