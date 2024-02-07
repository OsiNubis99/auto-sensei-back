import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as Schemas } from 'mongoose';

import { User, UserDocument } from '@database/schemas/user.schema';

@Schema({ _id: false, timestamps: true })
export class MessageI {
  @Prop()
  message: string;

  @Prop({ type: Schemas.Types.ObjectId, ref: User.name })
  user: UserDocument;

  @Prop()
  readAt?: Date;
}
