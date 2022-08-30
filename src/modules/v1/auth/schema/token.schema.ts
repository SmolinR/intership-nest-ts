import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongoSchema } from 'mongoose';

@Schema()
export class Token {
  @ApiProperty()
  @Prop()
  userId: string;

  @ApiProperty()
  @Prop()
  value: string;
}

export type TokenDocument = Token & Document;

export const TokenSchema: MongoSchema = SchemaFactory.createForClass(Token).set(
  'versionKey',
  false,
);
