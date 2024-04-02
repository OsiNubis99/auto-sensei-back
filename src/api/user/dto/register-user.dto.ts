import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { AddressDto } from '@common/dtos/address.dto';
import { LoginDto } from '@auth/dto/login.dto';

import { DealerDto } from './dealer.dto';
import { SellerDto } from './seller.dto';

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
  @Type(() => AddressDto)
  @ApiProperty({
    description: 'Seller data',
    required: false,
  })
  address?: Partial<AddressDto>;
}
