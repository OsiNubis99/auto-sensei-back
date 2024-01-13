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
import { ApiTags } from '@nestjs/swagger';

import { AuthRequest } from '@common/decorators/auth-request';
import { BasicRequest } from '@common/decorators/basic-request';
import { IdDto } from '@common/dtos/id.dto';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { Either } from '@common/generics/Either';
import { FaqDocument } from '@database/schemas/faq.schema';

import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqService } from './faq.service';
import { CreateFaqService } from './service/create-faq.service';
import { UpdateFaqService } from './service/update-faq.service';

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
  oneFaq(@Param() param: IdDto) {
    return this.faqService.findOne({ _id: param.id });
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
    @Param() param: IdDto,
    @Body() body: UpdateFaqDto,
  ): Promise<Either<FaqDocument>> {
    return this.updateFaqService.execute({ _id: param.id, ...body });
  }

  @Delete('/:id')
  @AuthRequest<FaqDocument>({
    description: 'Create a new user',
    response: 'User Document',
    roles: [UserTypeEnum.admin],
  })
  delete(@Param() param: IdDto) {
    return this.faqService.delete({ _id: param.id });
  }
}
