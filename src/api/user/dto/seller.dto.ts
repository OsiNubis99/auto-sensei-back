import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

import { SellerI } from '@database/interfaces/seller.interface';

export class SellerDto implements SellerI {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Seller picture',
    example: 'url',
  })
  picture: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Seller first name',
    example: 'Barry',
  })
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Seller last name',
    example: 'Allen',
  })
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Seller address',
    example: 'url',
  })
  address: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Seller driver license',
    example: 'url',
  })
  driverLicense: string;

  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Seller phone',
    example: '+13254453',
  })
  phone: string;
}
