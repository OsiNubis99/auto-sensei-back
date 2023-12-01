import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { UserTypeEnum } from '@common/enums/user-type.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    enum: UserTypeEnum,
  })
  type: UserTypeEnum;

  @Prop()
  name: string;

  @Prop({
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({
    unique: true,
  })
  username: string;

  @Prop({ select: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
