import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FilterAuctionDto extends SortAuctionDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
    required: false,
  })
  make?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
    required: false,
  })
  model?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
    required: false,
  })
  trim?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
    required: false,
  })
  bodyType?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
    required: false,
  })
  cylinder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
    required: false,
  })
  transmission?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
    required: false,
  })
  doors?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
    required: false,
  })
  driveTrain?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Auction is finished',
    required: false,
  })
  color?: string[];

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
    required: false,
  })
  yearStart?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
    required: false,
  })
  yearEnd?: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
    required: false,
  })
  odometerStart?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Auction is finished',
    required: false,
  })
  odometerEnd?: number;
}
