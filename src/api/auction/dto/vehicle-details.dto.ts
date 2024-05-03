import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { DriveTrainEnum } from '@common/enums/drive-train.enum';
import { VehicleDetailsI } from '@database/interfaces/vehicle-details.interface';

export class VehicleDetailsDto implements VehicleDetailsI {
  @IsOptional()
  vin: string;

  @IsOptional()
  trimOptions: [];

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'basePrice',
    required: false,
  })
  basePrice: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'year',
    required: false,
  })
  year: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'make',
    required: false,
  })
  make: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'model',
    required: false,
  })
  model: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'trim',
    required: false,
  })
  trim: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'bodyType',
    required: false,
  })
  bodyType: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'cylinder',
    required: false,
  })
  cylinder: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'transmission',
    required: false,
  })
  transmission: string;

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

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
    required: false,
  })
  repairs?: string;
}
