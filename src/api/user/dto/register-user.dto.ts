import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { LoginDto } from '@auth/dto/login.dto';

import { DealerDto } from './dealer.dto';
import { SellerDto } from './seller.dto';
import { AddressI } from '@database/interfaces/address.interface';

export class RegisterUserDto extends LoginDto {
  @IsOptional()
  isAdmin?: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SellerDto)
  @ApiProperty({
    description: 'Seller data',
    required: false,
  })
  seller?: SellerDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DealerDto)
  @ApiProperty({
    description: 'Dealer data',
    required: false,
  })
  dealer?: DealerDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AddressI)
  @ApiProperty({
    description: 'Seller data',
    required: false,
  })
  address?: AddressI;
}
