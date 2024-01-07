import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FilterAuctionDto {
  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Auction is finished',
  })
  make: string;

  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Auction is finished',
  })
  model: string;

  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Auction is finished',
  })
  trim: string;

  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Auction is finished',
  })
  bodyType: string;

  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Auction is finished',
  })
  cylinder: string;

  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Auction is finished',
  })
  transmission: string;

  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Auction is finished',
  })
  doors: string;

  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Auction is finished',
  })
  driveTrain: string;

  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Auction is finished',
  })
  color: string[];

  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Auction is finished',
  })
  yearStart: string;

  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Auction is finished',
  })
  yearEnd: string;

  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Auction is finished',
  })
  odometerStart: string;

  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Auction is finished',
  })
  odometerEnd: string[];
}
