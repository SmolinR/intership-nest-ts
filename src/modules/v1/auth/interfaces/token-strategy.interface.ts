import { ObjectId } from 'mongoose';

export interface ITokenStrategy {
  id: ObjectId;
  email: string;
  name: string;
}
