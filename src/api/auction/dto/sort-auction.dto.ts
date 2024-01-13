import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { SortAuctionEnum } from '../enum/sort-auction.enum';

export class SortAuctionDto {
  @IsOptional()
  @IsEnum(SortAuctionEnum)
  @ApiProperty({
    example: SortAuctionEnum.date,
    enum: SortAuctionEnum,
    description: 'Auction sort',
    required: false,
  })
  sortBy?: SortAuctionEnum;
}
