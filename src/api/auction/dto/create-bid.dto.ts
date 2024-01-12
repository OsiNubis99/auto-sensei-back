import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBidDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bid amount',
  })
  amount: number;

  @IsOptional()
  @ApiProperty({
    description: 'Bidding limit for Auto-Bid',
  })
  biddingLimit?: number;
}
