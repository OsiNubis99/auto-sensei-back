import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { DealerI } from '@database/interfaces/dealer.interface';

export class UpdateDealerDto implements DealerI {
  @IsOptional()
  @ApiProperty({
    description: 'Dealer picture',
    example: 'url',
    required: false,
  })
  picture: string;

  @IsOptional()
  @ApiProperty({
    description: 'Dealer name',
    example: 'Barry Allen',
    required: false,
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    description: 'Dealer OMVIC',
    example: 'Allen',
    required: false,
  })
  omvic: string;

  @IsOptional()
  @ApiProperty({
    description: 'Dealer address',
    example: 'My house',
    required: false,
  })
  address: string;

  @IsOptional()
  @ApiProperty({
    description: 'Dealer phone',
    example: '+13254453',
    required: false,
  })
  phone: string;
}
