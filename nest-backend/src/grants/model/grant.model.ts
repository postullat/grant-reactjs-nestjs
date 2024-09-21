import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Grant {
  @Field()
  id: string;

  @Field()
  foundationName: string;

  @Field()
  grantName: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  location: string;

  @Field()
  amount: number;

  @Field()
  status: string;

  @Field()
  deadline: Date;

  @Field()
  matchDate: Date;

  @Field({ nullable: true })
  feedback: string;
}
