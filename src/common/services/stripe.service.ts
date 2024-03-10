import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { default as Stripe } from 'stripe';

import { CardDto } from '@common/dtos/card.dto';
import { MakePaymentDto } from '@common/dtos/make-payment.dto';
import { Either } from '@common/generics/either';
import { BillingDetailsI } from '@database/interfaces/billing-details.interface';

@Injectable()
export default class StripeService {
  private stripe: Stripe;
  private _stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('stripe.public_key'));
    this._stripe = new Stripe(this.configService.get('stripe.private_key'));
  }

  public async createCustomer(name: string, email: string) {
    try {
      const customer = await this._stripe.customers.create({
        name,
        email,
      });
      if (!customer) return Either.makeLeft('Payment intent error');
      return Either.makeRight(customer);
    } catch (err) {
      Logger.error(err);
      return Either.makeLeft(err);
    }
  }

  public async addPaymentMethod(
    customerId: string,
    billing_details: BillingDetailsI,
    card: CardDto,
  ) {
    try {
      let paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        billing_details,
        card,
      });
      if (!paymentMethod) return Either.makeLeft('Bad car details');

      paymentMethod = await this._stripe.paymentMethods.attach(
        paymentMethod.id,
        {
          customer: customerId,
        },
      );
      if (!paymentMethod) return Either.makeLeft('Bad car details');

      return Either.makeRight(paymentMethod);
    } catch (err) {
      Logger.error(err);
      return Either.makeLeft(err);
    }
  }

  public async makePayment({ amount, ...body }: MakePaymentDto) {
    try {
      const paymentIntent = await this._stripe.paymentIntents.create({
        currency: 'cad',
        confirm: true,
        off_session: true,
        amount: amount * 100,
        ...body,
      });
      if (!paymentIntent) return Either.makeLeft('Payment intent error');
      return Either.makeRight(paymentIntent);
    } catch (err) {
      Logger.error(err);
      return Either.makeLeft(err);
    }
  }
}
