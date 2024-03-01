import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { render } from 'pdfml';

@Injectable()
export default class PDFService {
  constructor() {}

  async generatePDF(body: string) {
    return render({
      path: join(process.cwd(), 'templates', 'contract.ejs'),
      data: { text: body },
    });
  }
}
