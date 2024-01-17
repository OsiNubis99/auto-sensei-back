import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';

import { User, UserDocument } from './user.schema';
import { Auction, AuctionDocument } from './auction.schema';
import { MessageI } from '@database/interfaces/message.interface';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
  @Prop()
  messages: MessageI[];

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: Auction.name })
  auction: AuctionDocument;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: User.name })
  participant: UserDocument;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
