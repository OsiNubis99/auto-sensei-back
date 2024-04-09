import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { AddressI } from '@database/interfaces/address.interface';

export class AddressDto implements AddressI {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'city',
    example: 'city',
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'country',
    example: 'country',
  })
  country: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'line1',
    example: 'line1',
  })
  line1?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'line2',
    example: 'line2',
  })
  line2?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'postal code',
    example: 'postal code',
  })
  postal_code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'state',
    example: 'state',
  })
  state: string;
}
