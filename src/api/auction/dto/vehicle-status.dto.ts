import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { VehicleStatusEnum } from '@common/enums/vehicle-status.enum';
import { VehicleStatusI } from '@database/interfaces/vehicle-status.interface';

export class VehicleStatusDto implements VehicleStatusI {
  @IsNotEmpty()
  @ApiProperty({
    enum: VehicleStatusEnum,
    example: VehicleStatusEnum.paidOff,
    description: 'Auction status',
  })
  status: VehicleStatusEnum;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  financingCompany?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  remainingPayments?: number;
}
