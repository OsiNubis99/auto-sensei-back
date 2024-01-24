import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as Schemas } from 'mongoose';

import { ValorationEnum } from '@common/enums/valoration.enum';
import { User, UserDocument } from '@database/schemas/user.schema';

@Schema({ _id: false })
export class ValorationI {
  @Prop()
  valoration: ValorationEnum;

  @Prop()
  comment?: string;

  @Prop({ type: Schemas.Types.ObjectId, ref: User.name })
  user: UserDocument;
}
