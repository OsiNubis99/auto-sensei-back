import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { FaqService } from './faq.service';
import { CreateFaqService } from './service/create-faq.service';
import { BasicRequest } from '@common/decorators/basic-request';
import { ApiTags } from '@nestjs/swagger';
import { FaqDocument } from '@database/schemas/faq.schema';
import { CreateFaqDto } from './dto/create-faq.dto';
import { Either } from '@common/generics/Either';
import { UpdateFaqService } from './service/update-faq.service';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { AuthRequest } from '@common/decorators/auth-request';
import { UserTypeEnum } from '@common/enums/user-type.enum';

@Injectable()
@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(
    private readonly faqService: FaqService,
    private readonly createFaqService: CreateFaqService,
    private readonly updateFaqService: UpdateFaqService,
  ) {}

  @Get('/')
  @BasicRequest<FaqDocument[]>({
    description: 'Create a new user',
    response: 'User Document',
  })
  faq() {
    return this.faqService.findAll();
  }

  @Get('/:id')
  @BasicRequest<FaqDocument>({
    description: 'Create a new user',
    response: 'User Document',
  })
  oneFaq(@Param('id') _id: string) {
    return this.faqService.findOne({ _id });
  }

  @Post('/')
  @AuthRequest<FaqDocument>({
    description: 'Create a new faq',
    response: 'FAQ Document',
    roles: [UserTypeEnum.admin],
  })
  async createFaq(@Body() body: CreateFaqDto): Promise<Either<FaqDocument>> {
    return this.createFaqService.execute(body);
  }

  @Put('/:id')
  @AuthRequest<FaqDocument>({
    description: 'Create a new user',
    response: 'User Document',
    roles: [UserTypeEnum.admin],
  })
  update(
    @Param('id') id: string,
    @Body() body: UpdateFaqDto,
  ): Promise<Either<FaqDocument>> {
    return this.updateFaqService.execute({ id, ...body });
  }

  @Delete('/:id')
  @AuthRequest<FaqDocument>({
    description: 'Create a new user',
    response: 'User Document',
    roles: [UserTypeEnum.admin],
  })
  delete(@Param('id') _id: string) {
    return this.faqService.delete({ _id });
  }
}
