import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

import { SellerI } from '@database/interfaces/seller.interface';

export class SellerDto implements SellerI {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Seller picture',
    example: 'url',
  })
  picture: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Seller first name',
    example: 'Barry',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Seller last name',
    example: 'Allen',
  })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Seller driver license',
    example: 'url',
  })
  driverLicense: string;

  @IsString()
  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Seller phone',
    example: '+13254453',
  })
  phone: string;
}
