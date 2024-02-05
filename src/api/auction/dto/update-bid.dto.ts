import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateBidDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bidding limit for Auto-Bid',
    required: false,
  })
  biddingLimit?: number;
}
