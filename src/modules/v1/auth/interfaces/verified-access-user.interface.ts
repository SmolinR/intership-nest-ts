import { Types } from 'mongoose';

export interface IVerifiedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
}
