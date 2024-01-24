import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ValuationEnum } from '@common/enums/valuation.enum';

export class ValorateAuctionDto {
  @IsNotEmpty()
  @IsEnum(ValuationEnum)
  @ApiProperty({
    example: ValuationEnum.s3,
    enum: ValuationEnum,
    description: 'Auction valoration',
  })
  valoration: ValuationEnum;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Nice Auction',
    description: 'Auction valoration comment',
  })
  comment: string;
}
