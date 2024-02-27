import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Length,
  ValidateNested,
} from 'class-validator';

import { LoginDto } from '@auth/dto/login.dto';
import { PhoneDto } from '@common/dtos/phone.dto';

import { DealerDto } from './dealer.dto';
import { SellerDto } from './seller.dto';

export class RegisterUserDto extends IntersectionType(LoginDto, PhoneDto) {
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

  @IsNumberString()
  @Length(6, 6)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Phone validation code',
    example: '720901',
  })
  validationCode: string;
}
