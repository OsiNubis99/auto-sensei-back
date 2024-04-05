import AWSService from '@common/services/aws.service';
import PDFService from '@common/services/pdf.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import * as htmtest from 'html-pdf-node';

class Test {
  @IsOptional()
  @ApiProperty({
    description: 'Seller data',
    required: false,
  })
  text: string;
}

@Controller()
export class AppController {
  constructor(private de: PDFService, private awsService: AWSService) {}

  @Get()
  getHello() {
    return 'Hi';
  }

  @Post('/test')
  async getVin(@Body() { text }: Test) {
    const file = {
      content: text,
    };
    const options = { format: 'A4' };
    const doc = await htmtest.generatePdf(file, options);
    return await this.awsService.upload(
      'auction/contract',
      'aeuoeuaoeu-not-signed.pdf',
      doc,
    );
  }
}
