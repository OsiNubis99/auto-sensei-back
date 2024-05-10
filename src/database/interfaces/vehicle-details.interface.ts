import { DriveTrainEnum } from '@common/enums/drive-train.enum';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: false })
export class VehicleDetailsI {
  @Prop()
  vin: string;
  @Prop()
  basePrice: number;
  @Prop()
  year: string;
  @Prop()
  make: string;
  @Prop()
  model: string;
  @Prop()
  cylinder: string;
  @Prop()
  transmission: string;
  @Prop()
  odometer?: number;
  @Prop()
  color?: string;
  @Prop()
  aditionals?: string;
  @Prop()
  tireCondition?: string;
  @Prop()
  tireReplacement?: string;
  @Prop()
  brakeCondition?: string;
  @Prop()
  brakeReplacement?: string;
  @Prop()
  repairs?: string;

  @Prop()
  trim: string;
  @Prop()
  bodyType: string;
  @Prop()
  driveTrain?: DriveTrainEnum;
  @Prop()
  doors?: string;
  @Prop()
  trimOptions: TrimOptions[];

  @Prop()
  originalDocument?: string;
  @Prop()
  driverLicense?: string;
  @Prop()
  exteriorPhotos?: string[];
  @Prop()
  interiorPhotos?: string[];
  @Prop()
  vehicleDamage?: string[];
  @Prop()
  additionalDocuments?: string[];
  @Prop()
  vehicleVideo?: string;
}

export class TrimOptions {
  trim: string;
  bodyType: string;
  driveTrain?: DriveTrainEnum;
  doors?: string;
}
