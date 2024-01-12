import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { BuyNewI } from '@database/interfaces/buy-new.interface';

export class BuyNewDto implements BuyNewI {
  @IsOptional()
  @ApiProperty({
    description: 'Buy new data',
  })
  anyVehicle: boolean;

  @IsOptional()
  @ApiProperty({
    description: 'Buy new data',
  })
  make: string;

  @IsOptional()
  @ApiProperty({
    description: 'Buy new data',
  })
  model: string;

  @IsOptional()
  @ApiProperty({
    description: 'Buy new data',
  })
  mileageStart: string;

  @IsOptional()
  @ApiProperty({
    description: 'Buy new data',
  })
  mileageEnd: string;

  @IsOptional()
  @ApiProperty({
    description: 'Buy new data',
  })
  yearStart: string;

  @IsOptional()
  @ApiProperty({
    description: 'Buy new data',
  })
  yearEnd: string;
}
