import { ApiProperty } from '@nestjs/swagger';
import { ValidateBy } from 'class-validator';
import { isValidObjectId, Schema } from 'mongoose';

export class IdDto {
  @ApiProperty({
    description: 'id',
  })
  @ValidateBy({
    name: 'id',
    validator: {
      validate: isValidObjectId,
      defaultMessage: (err) =>
        'id should be a valid value, received ' + err.value,
    },
  })
  id: Schema.Types.ObjectId;
}
