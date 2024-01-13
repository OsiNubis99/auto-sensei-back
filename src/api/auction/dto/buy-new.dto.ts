import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { BuyNewI } from '@database/interfaces/buy-new.interface';

export class BuyNewDto implements Partial<BuyNewI> {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Buy new data',
    required: false,
  })
  anyVehicle?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Buy new data',
    required: false,
  })
  make?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Buy new data',
    required: false,
  })
  model?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Buy new data',
    required: false,
  })
  mileageStart?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Buy new data',
    required: false,
  })
  mileageEnd?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Buy new data',
    required: false,
  })
  yearStart?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Buy new data',
    required: false,
  })
  yearEnd?: string;
}
