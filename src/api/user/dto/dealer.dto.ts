import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

import { DealerI } from '@database/interfaces/dealer.interface';

export class DealerDto implements DealerI {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Dealer picture',
    example: 'url',
  })
  picture: string;

  @IsAlpha()
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

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Dealer address',
    example: 'My house',
  })
  address: string;

  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Dealer phone',
    example: '+15557720901',
  })
  phone: string;
}
