import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, ValidateNested } from 'class-validator';

import { CreateAuctionDto } from './create-auction.dto';
import { VehicleDetailsDto } from './vehicle-details.dto';

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {
  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Start date',
    required: false,
  })
  startDate?: Date;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Auciton duration in minutes',
    required: false,
  })
  duration?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VehicleDetailsDto)
  @ApiProperty({
    description: 'Vehicle details data',
    required: false,
  })
  vehicleDetails?: VehicleDetailsDto;
}
