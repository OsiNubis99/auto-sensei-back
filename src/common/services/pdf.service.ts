import { Injectable } from '@nestjs/common';
import * as ejs from 'ejs';
import { generatePdf } from 'html-pdf-node';
import { join } from 'path';

import { CreateContractDto } from '@common/dtos/create-contract.dto';

@Injectable()
export default class PDFService {
  constructor() {}

  async generatePDF(body: CreateContractDto) {
    const file = {
      content: await ejs.renderFile(
        join(process.cwd(), 'templates', 'contract.ejs'),
        body,
      ),
    };
    const options = { format: 'A4' };
    return await generatePdf(file, options);
  }
}
