import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { BuyNewDto } from './buy-new.dto';
import { VehicleStatusDto } from './vehicle-status.dto';

export class CreateAuctionDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Auction VIN',
  })
  vin: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Auction Drop Off Date',
  })
  dropOffDate: Date;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Auction City',
  })
  city: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Auction Province',
  })
  province: string;

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
  })
  vehicleStatus: VehicleStatusDto;

  @IsOptional()
  @ApiProperty({
    description: 'Auction Buyout',
  })
  buyout: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BuyNewDto)
  @ApiProperty({
    description: 'Auction Buy New data',
  })
  buyNew: BuyNewDto;
}
