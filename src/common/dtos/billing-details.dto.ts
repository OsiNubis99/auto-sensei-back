import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

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

  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: 'Email',
    example: 'barryallen@justiceleague.com',
  })
  email?: string;

  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Phone number with extension',
    example: '+18004444444',
  })
  phone?: string;
}
