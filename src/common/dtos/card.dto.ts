import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CardDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Card Number',
    example: '4242424242424242',
  })
  number: string;

  @IsNumber()
  @Min(1)
  @Max(31)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Dealer picture',
    example: 2,
  })
  exp_month: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Dealer picture',
    example: 11,
  })
  exp_year: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Dealer picture',
    example: '123',
  })
  cvc: string;
}
