import * as bcrypt from 'bcrypt';
import UserRepository from './users.repository';

import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { Types, UpdateWriteOpResult } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  public async create(user: CreateUserDto): Promise<User> {
    const salt: string = await bcrypt.genSalt(10);
    const hashed: string = await bcrypt.hash(user.password, salt);
    return this.userRepository.create({
      email: user.email,
      name: user.name,
      password: hashed,
    });
  }

  public getAll(): Promise<User[] | []> {
    return this.userRepository.getAll();
  }

  public getById(id: Types.ObjectId): Promise<User | null> {
    return this.userRepository.getById(id);
  }

  public getByIdAndUpdate(
    data: UpdateUserDto,
  ): Promise<UpdateWriteOpResult | null> {
    return this.userRepository.getByIdAndUpdate(data);
  }

  public getByEmail(email: string): Promise<UserDocument | null> {
    return this.userRepository.getByEmail(email);
  }
}
