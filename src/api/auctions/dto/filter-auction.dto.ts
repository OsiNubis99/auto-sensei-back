import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SortAuctionDto } from './sort-auction.dto';

export class FilterAuctionDto extends SortAuctionDto {
  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
  })
  make: string;

  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
  })
  model: string;

  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
  })
  trim: string;

  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
  })
  bodyType: string;

  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
  })
  cylinder: string;

  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
  })
  transmission: string;

  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
  })
  doors: string;

  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
  })
  driveTrain: string;

  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
  })
  color: string[];

  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
  })
  yearStart: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
  })
  yearEnd: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
  })
  odometerStart: number;

  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
  })
  odometerEnd: number;
}
