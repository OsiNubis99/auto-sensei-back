import { DriveTrainEnum } from '@common/enums/drive-train.enum';

export class VehicleDetailsI {
  vin: string;
  year: string;
  make: string;
  model: string;
  series: string;
  bodyType: string;
  cylinder: string;
  transmission: string;

  odometer: string;
  doors: string;
  color: string;
  driveTrain: DriveTrainEnum;
  aditionals: string;
  tireCondition: string;
  tireReplacement: string;
  brakeCondition: string;
  brakeReplacement: string;
}
