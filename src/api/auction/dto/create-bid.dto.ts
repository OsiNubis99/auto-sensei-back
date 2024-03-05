import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, ValidateBy } from 'class-validator';
import { isValidObjectId } from 'mongoose';

export class CreateBidDto {
  @ApiProperty({
    description: 'id',
    type: String,
  })
  @ValidateBy({
    name: 'id',
    validator: {
      validate: isValidObjectId,
      defaultMessage: (err) =>
        'id should be a valid value, received ' + err.value,
    },
  })
  idPaymentMethod: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bid amount',
  })
  amount: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Bidding limit for Auto-Bid',
    required: false,
  })
  biddingLimit?: number;
}
