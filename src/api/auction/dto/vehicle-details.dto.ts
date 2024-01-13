import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { DriveTrainEnum } from '@common/enums/drive-train.enum';

export class VehicleDetailsDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  odometer?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  doors?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  color?: string;

  @IsEnum(DriveTrainEnum)
  @IsOptional()
  @ApiProperty({
    enum: DriveTrainEnum,
    example: DriveTrainEnum['4WD'],
    description: 'Auction status',
    required: false,
  })
  driveTrain?: DriveTrainEnum;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  aditionals?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  tireCondition?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  tireReplacement?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  brakeCondition?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  brakeReplacement?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  rotorCondition?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  rotorReplacement?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  originalDocument?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  driverLicense?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  exteriorPhotos?: string[];

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  interiorPhotos?: string[];

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  vehicleDamage?: string[];

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  additionalDocuments?: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  vehicleVideo?: string;
}
