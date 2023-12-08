import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { UpdateDealerDto } from './update-dealer.dto';
import { UpdateSellerDto } from './update-seller.dto';

export class UpdateUserDto {
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

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'user email',
    example: 'barryallen@justiceleague.com',
    required: false,
  })
  email: string;

  @IsOptional()
  @ApiProperty({
    description: 'user password',
    example: 'theFastestManAlive1*',
    required: false,
  })
  password: string;
}
