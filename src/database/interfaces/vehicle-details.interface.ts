import { DriveTrainEnum } from '@common/enums/drive-train.enum';

export class VehicleDetailsI {
  vin: string;
  basePrice: number;
  year: string;
  make: string;
  model: string;
  trim: string;
  bodyType: string;
  cylinder: string;
  transmission: string;

  odometer?: number;
  doors?: string;
  color?: string;
  driveTrain?: DriveTrainEnum;
  aditionals?: string;
  tireCondition?: string;
  tireReplacement?: string;
  brakeCondition?: string;
  brakeReplacement?: string;

  originalDocument?: string;
  driverLicense?: string;
  exteriorPhotos?: string[];
  interiorPhotos?: string[];
  vehicleDamage?: string[];
  additionalDocuments?: string[];
  vehicleVideo?: string;
}
