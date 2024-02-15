import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import StripeService from '@common/services/stripe.service';
import { UserDocument } from '@database/schemas/user.schema';

import { AddPaymentMethodDto } from '@api/user/dto/add-payment-method.dto';
import { PaymentMethodI } from '@database/interfaces/payment-method.interface';

type P = AddPaymentMethodDto & {
  user: UserDocument;
};

type R = UserDocument;

@Injectable()
export class AddPaymentMethodService
  implements AppServiceI<P, R, HttpException>
{
  constructor(private stripeService: StripeService) {}

  async execute({ user, ...param }: P) {
    const paymentMethodResponse = await this.stripeService.addPaymentMethod(
      param.billing_details,
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

    const paymentMethod: PaymentMethodI = {
      cardDto: param.card,
      stripePaymentId: paymentMethodResponse.getRight().id,
      billingDetails: paymentMethodResponse.getRight().billing_details,
      card: {
        last4: paymentMethodResponse.getRight().card.last4,
        exp_month: paymentMethodResponse.getRight().card.exp_month,
        exp_year: paymentMethodResponse.getRight().card.exp_year,
      },
    };

    user.paymentMethods.push(paymentMethod);

    return Either.makeRight(await user.save());
  }
}
