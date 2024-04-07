import { CreateContractDto } from '@common/dtos/create-contract.dto';
import { Injectable } from '@nestjs/common';
import { generatePdf } from 'html-pdf-node';

@Injectable()
export default class PDFService {
  constructor() {}

  async generatePDF(body: CreateContractDto) {
    const file = {
      content: body.address_line_1,
    };
    const options = { format: 'A4' };
    return await generatePdf(file, options);
  }
}
