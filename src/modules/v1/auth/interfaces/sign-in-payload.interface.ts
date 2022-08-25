import { Types } from 'mongoose';

export interface ISignInPayload {
  readonly _id?: Types.ObjectId;
  readonly email: string;
  readonly name: string;
  readonly password?: string;
}
