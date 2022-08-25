import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, User } from './schemas/user.schema';
import { Types, Model, UpdateWriteOpResult } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export default class UsersRepository {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
  ) {}
  public async create(user: CreateUserDto): Promise<User> {
    const person: User = await this.usersModel.create({
      ...user,
    });

    return person;
  }
  public getAll() {
    return this.usersModel.find({}, { password: 0 }).exec();
  }
  public getById(id: Types.ObjectId): Promise<User | null> {
    return this.usersModel.findById(id).exec();
  }

  public getByIdAndUpdate({
    id,
    ...data
  }: UpdateUserDto): Promise<UpdateWriteOpResult | null> {
    console.log(data);
    return this.usersModel.updateOne({ _id: id }, { $set: data }).exec();
  }
  public getByEmail(email: string): Promise<UserDocument | null> {
    return this.usersModel.findOne({ email }).exec();
  }
}
