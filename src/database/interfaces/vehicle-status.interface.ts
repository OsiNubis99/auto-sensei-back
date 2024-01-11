import { VehicleStatusEnum } from '@common/enums/vehicle-status.enum';

export class VehicleStatusI {
  status: VehicleStatusEnum;
  financingCompany?: string;
  remainingPayments?: number;
}
