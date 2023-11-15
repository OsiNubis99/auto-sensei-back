import { Field, InputType, PartialType } from '@nestjs/graphql';

import { CreateFaqInput } from '../input/create-faq.input';

@InputType()
export class UpdateFaqDto extends PartialType(CreateFaqInput) {
  @Field({ description: 'FAQ Id' })
  id: string;
}
