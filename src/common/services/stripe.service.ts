import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { default as Stripe } from 'stripe';

import { MakePaymentDto } from '@common/dtos/make-payment.dto';
import { Either } from '@common/generics/either';

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

  public async createSession(userId: string, customerId: string) {
    try {
      const session = await this._stripe.checkout.sessions.create({
        mode: 'setup',
        currency: 'cad',
        client_reference_id: userId,
        customer: customerId,
        success_url:
          this.configService.get<string>('server.frontUrl') +
          '/success-created-payment-method?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: this.configService.get<string>('server.frontUrl'),
      });
      if (!session || !session.url)
        return Either.makeLeft('Payment intent error');
      return Either.makeRight({ url: session.url });
    } catch (err) {
      Logger.error(err);
      return Either.makeLeft(err);
    }
  }

  public async makePayment({ amount, ...body }: MakePaymentDto) {
    try {
      return Either.makeRight(
        await this._stripe.paymentIntents.create({
          currency: 'cad',
          confirm: true,
          off_session: true,
          amount: amount * 100,
          ...body,
        }),
      );
    } catch (err) {
      Logger.error(err);
      return Either.makeLeft(err);
    }
  }
}
