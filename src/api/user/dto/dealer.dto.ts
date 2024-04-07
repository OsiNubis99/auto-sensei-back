import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PhoneDto } from '@common/dtos/phone.dto';
import { DealerI } from '@database/interfaces/dealer.interface';

export class DealerDto extends PartialType(PhoneDto) implements DealerI {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Dealer picture',
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
    description: 'Dealer name',
    example: 'Barry Allen',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Dealer OMVIC',
    example: 'Allen',
  })
  omvic: string;
}
