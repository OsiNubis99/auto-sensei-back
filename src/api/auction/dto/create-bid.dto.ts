import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateBidDto {
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
