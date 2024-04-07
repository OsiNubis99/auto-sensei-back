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
import axios from 'axios';
import { Request, Response } from 'express';

import { BasicRequest } from '@common/decorators/basic-request';
import { ContactDto } from '@common/dtos/contact.dto';
import { Either } from '@common/generics/either';

@Controller()
export class AppController {
  constructor(private mailerService: MailerService) {}

  @Get()
  getHello() {
    return 'Hi';
  }

  @Post('/contact')
  @BasicRequest({ description: 'Send a new contac message', response: 'Ok' })
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
        res.header(resp.headers);
        res.send(resp.data);
      })
      .catch((err) => {
        res.send(err);
      });
  }
}
