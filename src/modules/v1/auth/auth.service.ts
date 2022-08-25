import * as bcrypt from 'bcrypt';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtDto } from './dto/jwt-tokens.dto';
import { ISignInPayload } from './interfaces/sign-in-payload.interface';
import AuthConstants from './auth.constants';
import { UserDocument } from '../users/schemas/user.schema';
import IUserOutput from './interfaces/validated-user-output';
import { IVerifiedUser } from './interfaces/verified-access-user.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import AuthRepository from './auth.repository';
import { Token } from './schema/token.schema';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async createTokens(payload: ISignInPayload): Promise<JwtDto> {
    const accessToken: string = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_SECRET'),
      expiresIn: AuthConstants.tokens.access.expiresIn,
    });
    const refreshToken: string = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: AuthConstants.tokens.refresh.expiresIn,
    });

    await this.updateOrSaveToken(payload._id, refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  public async updateOrSaveToken(userId, token) {
    const findRefresh: Token | null =
      await this.authRepository.findTokenByUserId(userId);

    if (!findRefresh) {
      return this.authRepository.create(userId, token);
    }
    await this.authRepository.deleteTokenById(userId);
    return this.authRepository.create(userId, token);
  }

  public async verifyByPassword(
    userPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const checkedPassword: boolean = await bcrypt.compare(
      userPassword,
      hashedPassword,
    );
    return checkedPassword;
  }

  public async validateUser(
    email: string,
    password: string,
  ): Promise<null | IUserOutput> {
    const user: UserDocument = await this.usersService.getByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const comparedPassword: boolean = await this.verifyByPassword(
      password,
      user.password,
    );

    if (comparedPassword === true) {
      return {
        _id: user._id,
        email: user.email,
        name: user.name,
      };
    }

    return null;
  }

  public async verifyAccess(
    token: string,
    secret: string,
  ): Promise<IVerifiedUser | null> {
    try {
      const user: IVerifiedUser | null = (await this.jwtService.verify(token, {
        secret,
      })) as IVerifiedUser | null;

      return user;
    } catch (error) {
      return null;
    }
  }

  public async decodeToken(token: RefreshTokenDto) {
    return this.jwtService.decode(token.refreshToken) as IVerifiedUser;
  }

  public async getRefreshByValue(value: string): Promise<Token | null> {
    return this.authRepository.findToken(value);
  }

  public async getRefreshByUserId(
    userId: Types.ObjectId,
  ): Promise<Token | null> {
    const token: Token | null = await this.authRepository.findTokenByUserId(
      userId,
    );
    if (!token) {
      throw new NotFoundException('User not found!');
    }
    return token;
  }

  public async deleteToken(userId: Types.ObjectId) {
    return this.authRepository.deleteTokenById(userId);
  }

  public async signIn(data: ISignInPayload): Promise<JwtDto> {
    const payload: ISignInPayload = {
      _id: data._id,
      email: data.email,
      name: data.name,
    };

    return this.createTokens(payload);
  }
}
