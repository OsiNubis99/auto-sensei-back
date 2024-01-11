import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumberString, IsOptional, ValidateNested } from 'class-validator';

import { CreateAuctionDto } from './create-auction.dto';
import { VehicleDetailsDto } from './vehicle-details.dto';

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {
  @IsOptional()
  @ApiProperty({
    description: 'Start date',
  })
  startDate: Date;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    description: 'Auciton duration in minutes',
  })
  duration: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VehicleDetailsDto)
  @ApiProperty({
    description: 'Vehicle details data',
  })
  vehicleDetails: VehicleDetailsDto;
}
