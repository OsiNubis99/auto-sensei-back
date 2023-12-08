import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { LoginDto } from '@auth/dto/login.dto';

import { UpdateSellerDto } from './update-seller.dto';
import { UpdateDealerDto } from './update-dealer.dto';

export class RegisterUserDto extends LoginDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateSellerDto)
  @ApiProperty({
    description: 'Seller data',
  })
  seller: UpdateSellerDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateDealerDto)
  @ApiProperty({
    description: 'Dealer data',
  })
  dealer: UpdateDealerDto;
}
