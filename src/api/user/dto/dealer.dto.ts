import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PhoneDto } from '@common/dtos/phone.dto';
import { DealerI } from '@database/interfaces/dealer.interface';

export class DealerDto extends PhoneDto implements DealerI {
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
}
