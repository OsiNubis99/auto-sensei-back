import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as Schemas } from 'mongoose';

import { ValuationEnum } from '@common/enums/valuation.enum';
import { User, UserDocument } from '@database/schemas/user.schema';

@Schema({ _id: false })
export class ValuationI {
  @Prop()
  valoration: ValuationEnum;

  @Prop()
  comment?: string;

  @Prop({ type: Schemas.Types.ObjectId, ref: User.name })
  user: UserDocument;
}
