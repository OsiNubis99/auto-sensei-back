import { ApiProperty } from '@nestjs/swagger';
import { ValidateBy } from 'class-validator';
import { isValidObjectId } from 'mongoose';

export class IdDto {
  @ApiProperty({
    description: 'id',
    type: String,
  })
  @ValidateBy({
    name: '_id',
    validator: {
      validate: isValidObjectId,
      defaultMessage: (err) =>
        'id should be a valid value, received ' + err.value,
    },
  })
  _id: string;
}
