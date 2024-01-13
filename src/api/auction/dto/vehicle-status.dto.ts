import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { VehicleStatusEnum } from '@common/enums/vehicle-status.enum';
import { VehicleStatusI } from '@database/interfaces/vehicle-status.interface';

export class VehicleStatusDto implements VehicleStatusI {
  @IsEnum(VehicleStatusEnum)
  @IsNotEmpty()
  @ApiProperty({
    enum: VehicleStatusEnum,
    example: VehicleStatusEnum.paidOff,
    description: 'Auction status',
    required: false,
  })
  status: VehicleStatusEnum;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  financingCompany?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  remainingPayments?: number;
}
