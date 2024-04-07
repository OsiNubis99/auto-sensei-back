import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';

import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { PaymentMethod } from '@database/schemas/payment-method.schema';
import { User } from '@database/schemas/user.schema';

type P = Stripe.PaymentMethod;

type R = string;

@Injectable()
export class AddPaymentMethodService
  implements AppServiceI<P, R, HttpException>
{
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(PaymentMethod.name)
    private paymentMethodModel: Model<PaymentMethod>,
  ) {}

  async execute(paymentMethod: P) {
    const user = await this.userModel.findOne({
      customerId: paymentMethod.customer.toString(),
    });
    if (!user) {
      return Either.makeLeft(
        new HttpException('user not valid', HttpStatus.BAD_REQUEST),
      );
    }

    const newPaymentMethod = new this.paymentMethodModel({
      stripePaymentId: paymentMethod.id,
      billingDetails: paymentMethod.billing_details,
      card: paymentMethod.card,
    });

    user.paymentMethods.push(await newPaymentMethod.save());

    await user.save();

    return Either.makeRight('OK');
  }
}
