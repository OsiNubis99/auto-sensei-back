import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import stripe from 'stripe';

import { AuthRequest } from '@common/decorators/auth-request';
import { BasicRequest } from '@common/decorators/basic-request';
import { UserD } from '@common/decorators/user.decorator';
import { Either } from '@common/generics/either';
import { UserDocument } from '@database/schemas/user.schema';

import { AddPaymentMethodService } from './services/add-payment-method.service';
import { CreateSessionService } from './services/create-session.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(
    private createSessionService: CreateSessionService,
    private readonly addPaymentMethodService: AddPaymentMethodService,
    private configService: ConfigService,
  ) {}

  @Get('/session-url')
  @AuthRequest({
    description: 'List User valorations',
    response: 'User valorations',
  })
  sessionUrl(@UserD() user: UserDocument) {
    return this.createSessionService.execute({ user });
  }

  @Post('/webhook')
  @BasicRequest({
    description: 'Upload a new file to AWS',
    response: 'Bucket url',
  })
  async webhook(@Req() request: Request) {
    const sig = request.headers['stripe-signature'];

    let event: stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        this.configService.get('stripe.endpoint_secret'),
      );
    } catch (err) {
      return Either.makeLeft(
        new HttpException('bad_request', HttpStatus.BAD_REQUEST),
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_method.attached':
        return await this.addPaymentMethodService.execute(event.data.object);
      default:
        Logger.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return Either.makeRight('');
  }
}
