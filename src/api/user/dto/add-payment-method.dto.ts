import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

import { CardDto } from '@common/dtos/card.dto';
import { BillingDetailsDto } from '@common/dtos/billing-details.dto';

export class AddPaymentMethodDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BillingDetailsDto)
  @ApiProperty({
    type: BillingDetailsDto,
    example: BillingDetailsDto,
    description: 'Payment Billing Details',
  })
  billing_details: BillingDetailsDto;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  @ApiProperty({
    description: 'Payment Card',
  })
  card: CardDto;
}
