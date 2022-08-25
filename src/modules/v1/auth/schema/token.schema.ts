import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

@Schema()
export class Token {
  @Prop()
  userId: string;

  @Prop()
  value: string;
}

export type TokenDocument = Token & Document;

export const TokenSchema: MongoSchema = SchemaFactory.createForClass(Token).set(
  'versionKey',
  false,
);
