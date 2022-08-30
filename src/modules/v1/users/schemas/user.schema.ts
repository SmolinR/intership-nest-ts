import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongoSchema } from 'mongoose';

@Schema()
export class User {
  @ApiProperty()
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  email: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  password: string;
}

export type UserDocument = User & Document;

export const UserSchema: MongoSchema = SchemaFactory.createForClass(User).set(
  'versionKey',
  false,
);
