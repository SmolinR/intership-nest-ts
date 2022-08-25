import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TokenDocument, Token } from './schema/token.schema';
import { Model, Types } from 'mongoose';
import { DeleteResult } from 'mongodb';
@Injectable()
export default class AuthRepository {
  constructor(
    @InjectModel(Token.name) private tokensModel: Model<TokenDocument>,
  ) {}
  public async create(userId: Types.ObjectId, value: string): Promise<Token> {
    return this.tokensModel.create({ userId, value });
  }

  public findTokenByUserId(
    userId: Types.ObjectId,
  ): Promise<TokenDocument | null> {
    return this.tokensModel.findOne({ userId }).exec();
  }

  public findToken(value: string): Promise<Token | null> {
    return this.tokensModel.findOne({ value }).exec();
  }

  public deleteTokenById(userId: Types.ObjectId): Promise<DeleteResult | null> {
    return this.tokensModel.deleteOne({ userId }).exec();
  }
}
