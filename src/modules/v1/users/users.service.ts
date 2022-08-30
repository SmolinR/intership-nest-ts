import * as bcrypt from 'bcrypt';
import UserRepository from './users.repository';

import { CreateUserDto } from './dto/create-user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
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

  public async getById(id: Types.ObjectId): Promise<User | null> {
    const user: User | null = await this.userRepository.getById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  public async getByIdAndUpdate(
    data: UpdateUserDto,
  ): Promise<UpdateWriteOpResult | null> {
    const result: UpdateWriteOpResult | null =
      await this.userRepository.getByIdAndUpdate(data);

    if (result.modifiedCount === 0) {
      throw new NotFoundException('User not found');
    }
    return result;
  }

  public getByEmail(email: string): Promise<UserDocument | null> {
    return this.userRepository.getByEmail(email);
  }
}
