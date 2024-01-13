import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BuyNewDto } from './buy-new.dto';
import { VehicleStatusDto } from './vehicle-status.dto';

export class CreateAuctionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Auction VIN',
  })
  vin: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Auction Drop Off Date',
  })
  dropOffDate: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Auction City',
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Auction Province',
  })
  province: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Auction Keys Number',
  })
  keysNumber: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VehicleStatusDto)
  @ApiProperty({
    description: 'Auction Buyout',
    required: false,
  })
  vehicleStatus?: VehicleStatusDto;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Auction Buyout',
    required: false,
  })
  buyout?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BuyNewDto)
  @ApiProperty({
    description: 'Auction Buy New data',
    required: false,
  })
  buyNew?: BuyNewDto;
}
