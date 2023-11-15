import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateFaqInput {
  @Field({
    description: 'FAQ Question',
  })
  readonly question: string;

  @Field({
    description: 'FAQ Answer',
  })
  readonly answer: string;
}
