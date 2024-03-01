import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { BillingDetailsI } from '@database/interfaces/billing-details.interface';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';

export class BillingDetailsDto implements BillingDetailsI {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  @ApiProperty({
    description: 'Seller data',
    required: false,
  })
  address: AddressDto;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Full name.',
    example: 'Barry Allen',
  })
  name: string;
}
