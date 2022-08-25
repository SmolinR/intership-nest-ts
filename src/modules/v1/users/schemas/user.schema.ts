import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

@Schema()
export class User {
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  email: string;

  @Prop()
  name: string;

  @Prop()
  password: string;
}

export type UserDocument = User & Document;

export const UserSchema: MongoSchema = SchemaFactory.createForClass(User).set(
  'versionKey',
  false,
);
