import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

import { SendCodeMessageDto } from '@common/dtos/send-code-message.dto';
import { SendRawMessageDto } from '@common/dtos/send-raw-message.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class TwilioService {
  private readonly client: Twilio;
  constructor(private configService: ConfigService) {
    this.client = new Twilio(
      configService.get('twilio.accountSID'),
      configService.get('twilio.authToken'),
    );
  }

  async sendCodeMessage(data: SendCodeMessageDto) {
    const messageResponse = await this.client.messages.create({
      shortenUrls: true,
      body: `Auto Sensei code: ${data.code}\nData and msg may apply.`,
      from: '+' + this.configService.get('twilio.number'),
      to: data.phone,
    });
    return !messageResponse.errorCode;
  }

  async sendRawMessage(data: SendRawMessageDto) {
    const messageResponse = await this.client.messages.create({
      shortenUrls: true,
      body: data.message,
      from: '+' + this.configService.get('twilio.number'),
      to: data.phone,
    });
    return !messageResponse.errorCode;
  }

  public getClient = () => this.client;
}
