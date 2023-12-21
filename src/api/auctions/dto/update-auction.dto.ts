import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { StatusEnum } from '@common/enums/status.enum';

import { CreateAuctionDto } from './create-auction.dto';
import { UpdateVehicleDetailsDto } from './update-vehicle-details.dto';

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {
  @IsOptional()
  @ApiProperty({
    enum: StatusEnum,
    example: StatusEnum.active,
    description: 'Auction status',
  })
  status: StatusEnum;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateVehicleDetailsDto)
  @ApiProperty({
    description: 'Vehicle details data',
  })
  vehicleDetails: UpdateVehicleDetailsDto;
}
