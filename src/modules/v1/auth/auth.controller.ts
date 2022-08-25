import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Body,
  ForbiddenException,
  UnauthorizedException,
  Get,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import LocalAuthGuard from './guards/local-auth.guard';
import { Request as ExpressRequest } from 'express';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { JwtDto } from './dto/jwt-tokens.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '../users/users.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { IVerifiedUser } from './interfaces/verified-access-user.interface';
import { Token } from './schema/token.schema';
import { ISignInPayload } from './interfaces/sign-in-payload.interface';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import AuthBearer from 'src/decorators/access-bearer.decorator';
import { ConfigService } from '@nestjs/config';
import WrapResponseInterceptor from '../../../interceptors/wrap-response.interceptor';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() user: SignUpDto): Promise<User> {
    return this.usersService.create(user);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Request() req: ExpressRequest): Promise<JwtDto> {
    return this.authService.signIn(req.user as User);
  }

  @Get('refresh/:id')
  async getRefresh(
    @Param('id', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<Token | null> {
    return this.authService.getRefreshByUserId(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(@Body() data: RefreshTokenDto): Promise<JwtDto | null> {
    const user: IVerifiedUser = await this.authService.decodeToken(data);

    if (!user) {
      throw new ForbiddenException('Invalid token');
    }

    const checkedRefreshToken: Token | null =
      await this.authService.getRefreshByUserId(user._id);

    if (data.userId !== user._id) {
      throw new UnauthorizedException('Incorrect id, unauthorized');
    }

    if (
      !checkedRefreshToken.value ||
      checkedRefreshToken.value != data.refreshToken
    ) {
      throw new UnauthorizedException('Token is missing or incorrect');
    }

    const payload: ISignInPayload = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };

    return this.authService.createTokens(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('logout')
  public async logout(
    @AuthBearer() accessToken: string,
  ): Promise<string | null> {
    const user: IVerifiedUser = await this.authService.verifyAccess(
      accessToken,
      this.configService.get<string>('ACCESS_SECRET'),
    );
    if (!user) {
      throw new ForbiddenException('Invalid token');
    }

    await this.authService.deleteToken(user._id);

    return 'Logged out';
  }
}
