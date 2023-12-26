import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { CreateAuctionDto } from './create-auction.dto';
import { UpdateVehicleDetailsDto } from './update-vehicle-details.dto';

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {
  @IsOptional()
  @ApiProperty({
    example: true,
    description: 'Auction is finished',
  })
  finished: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateVehicleDetailsDto)
  @ApiProperty({
    description: 'Vehicle details data',
  })
  vehicleDetails: UpdateVehicleDetailsDto;
}
