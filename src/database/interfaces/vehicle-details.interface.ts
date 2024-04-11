import { DriveTrainEnum } from '@common/enums/drive-train.enum';

export interface VehicleDetailsI {
  vin: string;
  basePrice: number;
  year: string;
  make: string;
  model: string;
  cylinder: string;
  transmission: string;
  odometer?: number;
  color?: string;
  aditionals?: string;
  tireCondition?: string;
  tireReplacement?: string;
  brakeCondition?: string;
  brakeReplacement?: string;

  trim: string;
  bodyType: string;
  driveTrain?: DriveTrainEnum;
  doors?: string;
  trimOptions: TrimOptions[];

  originalDocument?: string;
  driverLicense?: string;
  exteriorPhotos?: string[];
  interiorPhotos?: string[];
  vehicleDamage?: string[];
  additionalDocuments?: string[];
  vehicleVideo?: string;
}

export interface TrimOptions {
  trim: string;
  bodyType: string;
  driveTrain?: DriveTrainEnum;
  doors?: string;
}
