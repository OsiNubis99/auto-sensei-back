import { MailerService } from '@nestjs-modules/mailer';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import axios from 'axios';
import { IsOptional } from 'class-validator';
import { Request, Response } from 'express';
import { generatePdf } from 'html-pdf-node';

import { BasicRequest } from '@common/decorators/basic-request';
import { ContactDto } from '@common/dtos/contact.dto';
import { Either } from '@common/generics/either';
import AWSService from '@common/services/aws.service';
import PDFService from '@common/services/pdf.service';

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
  constructor(
    private de: PDFService,
    private mailerService: MailerService,
    private awsService: AWSService,
  ) {}

  @Get()
  getHello() {
    return 'Hi';
  }

  @BasicRequest({ description: 'Send a new contac message', response: 'Ok' })
  @Post('/contact')
  async contact(@Body() body: ContactDto) {
    try {
      await this.mailerService.sendMail({
        to: 'admin@autosensei.ca',
        subject: 'New Website Contact',
        template: 'contact',
        context: body,
      });
      return Either.makeRight('ok');
    } catch (err) {
      Logger.log(err);
      return Either.makeLeft(
        new HttpException('Error on mail', HttpStatus.BAD_REQUEST),
      );
    }
  }

  @Get('files/*')
  get(@Req() req: Request, @Res() res: Response): void {
    const url = `http://${process.env.AWS_BUCKET}/${req.url.slice(7)}`;
    axios({
      method: 'get',
      url,
      responseType: 'arraybuffer',
    })
      .then((resp) => {
        res.send(Buffer.from(resp.data, 'binary').toString('base64'));
      })
      .catch((err) => {
        res.send(err);
      });
  }

  @Post('/test')
  async getVin(@Body() { text }: Test) {
    const file = {
      content: text,
    };
    const options = { format: 'A4' };
    const doc = await generatePdf(file, options);
    return await this.awsService.upload(
      'auction/contract',
      'aeuoeuaoeu-not-signed.pdf',
      doc,
    );
  }
}
