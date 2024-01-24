import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ValorationEnum } from '@common/enums/valoration.enum';

export class ValorateAuctionDto {
  @IsNotEmpty()
  @IsEnum(ValorationEnum)
  @ApiProperty({
    example: ValorationEnum.s3,
    enum: ValorationEnum,
    description: 'Auction valoration',
  })
  valoration: ValorationEnum;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Nice Auction',
    description: 'Auction valoration comment',
  })
  comment: string;
}
