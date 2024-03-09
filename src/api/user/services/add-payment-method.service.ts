import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import StripeService from '@common/services/stripe.service';
import { UserDocument } from '@database/schemas/user.schema';

import { AddPaymentMethodDto } from '@api/user/dto/add-payment-method.dto';
import { PaymentMethod } from '@database/schemas/payment-method.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

type P = AddPaymentMethodDto & {
  user: UserDocument;
};

type R = string;

@Injectable()
export class AddPaymentMethodService
  implements AppServiceI<P, R, HttpException>
{
  constructor(
    @InjectModel(PaymentMethod.name)
    private paymentMethodModel: Model<PaymentMethod>,
    private stripeService: StripeService,
  ) {}

  async execute({ user, ...param }: P) {
    if (!user.customerId) {
      const name = user.dealer?.name || user.seller?.firstName || '';
      const customerResponse = await this.stripeService.createCustomer(
        name,
        user.email,
      );
      if (customerResponse.isLeft())
        return Either.makeLeft(
          new HttpException(customerResponse.getLeft(), HttpStatus.BAD_REQUEST),
        );
      user.customerId = customerResponse.getRight().id;
      await user.save();
    }
    const paymentMethodResponse = await this.stripeService.addPaymentMethod(
      user.customerId,
      { email: user.email, ...param.billing_details },
      param.card,
    );
    if (paymentMethodResponse.isLeft()) {
      return Either.makeLeft(
        new HttpException(
          paymentMethodResponse.getLeft(),
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const paymentMethod = new this.paymentMethodModel({
      cardDto: JSON.stringify(param.card),
      stripePaymentId: paymentMethodResponse.getRight().id,
      billingDetails: paymentMethodResponse.getRight().billing_details,
      card: paymentMethodResponse.getRight().card,
    });

    user.paymentMethods.push(await paymentMethod.save());

    await user.save();

    return Either.makeRight('OK');
  }
}
