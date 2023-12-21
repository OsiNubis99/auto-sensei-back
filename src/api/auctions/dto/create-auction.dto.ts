import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

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
  @ApiProperty({
    description: 'Auction Buyout',
  })
  vehicleStatus: string;

  @IsOptional()
  @ApiProperty({
    description: 'Auction Buyout',
  })
  buyout: string;

  @IsOptional()
  @ApiProperty({
    description: 'Auction Buy New data',
  })
  buyNew: string;
}
