import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { DriveTrainEnum } from '@common/enums/drive-train.enum';

export class UpdateVehicleDetailsDto {
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  vin: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  year: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  make: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  model: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  series: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  bodyType: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  cylinder: string;
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  transmission: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  odometer: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  doors: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  color: string;

  @IsOptional()
  @ApiProperty({
    enum: DriveTrainEnum,
    example: DriveTrainEnum['4WD'],
    description: 'Auction status',
  })
  driveTrain: DriveTrainEnum;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  aditionals: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  tireCondition: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  tireReplacement: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  brakeCondition: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  brakeReplacement: string;
}
