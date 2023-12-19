import { StatusEnum } from '@common/enums/status.enum';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateAuctionDto } from './create-auction.dto';

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {
  @IsOptional()
  @ApiProperty({
    enum: StatusEnum,
    example: StatusEnum.active,
    description: 'Auction status',
  })
  status: StatusEnum;
}
