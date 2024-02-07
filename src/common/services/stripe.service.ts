import { Injectable, Logger } from '@nestjs/common';
import { default as Stripe } from 'stripe';

import { CardDto } from '@common/dtos/card.dto';
import { Either } from '@common/generics/either';
import { BillingDetailsI } from '@database/interfaces/billing-details.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class StripeService {
  private _stripe: Stripe;

  constructor(private configService: ConfigService) {
    this._stripe = new Stripe(this.configService.get('stripe.key'));
  }

  public async addPaymentMethod(
    billing_details: BillingDetailsI,
    card: CardDto,
  ) {
    try {
      const paymentMethod = await this._stripe.paymentMethods.create({
        type: 'card',
        billing_details,
        card,
      });

      if (!paymentMethod) return Either.makeLeft('Bad car details');

      return Either.makeRight(paymentMethod);
    } catch (err) {
      Logger.error(err);
      return Either.makeLeft(err);
    }
  }
}
