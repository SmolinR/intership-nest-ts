import { ObjectId } from 'mongoose';

export default interface IUserOutput {
  _id?: ObjectId;
  email: string;
  name: string;
}
