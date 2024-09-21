import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GrantDocument = Grant & Document;

@Schema()
export class Grant {
  @Prop({ required: true })
  foundationName: string;

  @Prop({ required: true })
  grantName: string;

  @Prop()
  description: string;

  @Prop()
  location: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'open' }) // open, approved, rejected
  status: string;

  @Prop()
  deadline: Date;

  @Prop()
  matchDate: Date;

  @Prop()
  feedback: string;
}

export const GrantSchema = SchemaFactory.createForClass(Grant);
