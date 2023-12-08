import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { SellerI } from '@database/interfaces/seller.interface';

export class UpdateSellerDto implements SellerI {
  @IsOptional()
  @ApiProperty({
    description: 'Seller picture',
    example: 'url',
    required: false,
  })
  picture: string;

  @IsOptional()
  @ApiProperty({
    description: 'Seller first name',
    example: 'Barry',
    required: false,
  })
  firstName: string;

  @IsOptional()
  @ApiProperty({
    description: 'Seller last name',
    example: 'Allen',
    required: false,
  })
  lastName: string;

  @IsOptional()
  @ApiProperty({
    description: 'Seller driver license',
    example: 'url',
    required: false,
  })
  driverLicense: string;

  @IsOptional()
  @ApiProperty({
    description: 'Seller phone',
    example: '+13254453',
    required: false,
  })
  phone: string;
}
