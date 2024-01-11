import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { DriveTrainEnum } from '@common/enums/drive-train.enum';

export class VehicleDetailsDto {
  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  odometer: number;

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

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  rotorCondition: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  rotorReplacement: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  originalDocument: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  driverLicense: string;

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  exteriorPhotos: string[];

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  interiorPhotos: string[];

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  vehicleDamage: string[];

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  additionalDocuments: string[];

  @IsOptional()
  @ApiProperty({
    description: 'Vehicledetails',
  })
  vehicleVideo: string;
}
