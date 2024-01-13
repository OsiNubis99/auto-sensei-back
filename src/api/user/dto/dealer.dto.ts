import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

import { DealerI } from '@database/interfaces/dealer.interface';

export class DealerDto implements DealerI {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Dealer picture',
    example: 'url',
  })
  picture: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Dealer name',
    example: 'Barry Allen',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Dealer OMVIC',
    example: 'Allen',
  })
  omvic: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Dealer address',
    example: 'My house',
  })
  address: string;

  @IsString()
  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Dealer phone',
    example: '+13254453',
  })
  phone: string;
}
