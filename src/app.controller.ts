import VinDecoderService from '@common/services/vin-decoder.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private de: VinDecoderService) {}

  @Get()
  getHello() {
    return 'Hi';
  }

  @Get('/vin/:vin')
  getVin(@Param('vin') vin: string) {
    return this.de.getCarData(vin);
  }
}
