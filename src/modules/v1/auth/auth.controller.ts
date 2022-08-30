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
import { SignInDto } from './dto/sign-in.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiTags('Auth')
@ApiExtraModels(User)
@ApiExtraModels(Token)
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: 201,
    description: 'Returns if user sign-up is success',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(User),
        },
      },
    },
  })
  @ApiBadRequestResponse({
    status: 400,
    description:
      'Returns if creation fails and a validation error is encountered',
    schema: {
      type: 'object',
      example: {
        error: 'BadRequestException',
        message: 'Bad Request Exception',
        messages: [
          'email must be an email',
          'password must be longer than or equal to 8 characters',
        ],
      },
    },
  })
  @Post('sign-up')
  async signUp(@Body() user: SignUpDto): Promise<User> {
    return this.usersService.create(user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: 200,
    description: 'Returns if user sign-in is success',
    schema: {
      type: 'object',
      example: {
        data: {
          accessToken: 'string',
          refreshToken: 'string',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Returns if user unauthorized',
    schema: {
      type: 'object',
      example: {
        error: 'UnauthorizedException',
        message: 'Unauthorized',
      },
    },
  })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Returns if user not found in base',
    schema: {
      type: 'object',
      example: {
        error: 'ForbiddenException',
        message: 'User not found',
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Body() user: SignInDto): Promise<JwtDto> {
    return this.authService.signIn(user as User);
  }

  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    status: 200,
    description: 'Returns if refresh was found by user id',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(Token),
        },
      },
    },
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Returns if ObjectId parser not found expected value',
    schema: {
      type: 'object',
      example: {
        error: 'BadRequestException',
        message: 'Request failed (expected ObjectId)',
      },
    },
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Returns if user not found',
    schema: {
      type: 'object',
      example: {
        error: 'NotFoundException',
        message: 'User not found!',
      },
    },
  })
  @Get('refresh/:id')
  async getRefresh(
    @Param('id', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<Token | null> {
    return this.authService.getRefreshByUserId(userId);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: 200,
    description: 'Returns if token and user`s id was found and correct',
    schema: {
      type: 'object',
      example: {
        data: {
          accessToken: 'string',
          refreshToken: 'string',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Returns if validation error is encountered',
    schema: {
      type: 'object',
      example: {
        error: 'BadRequestException',
        message: 'Bad Request Exception',
        messages: ['userId should not be empty'],
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Returns if user not found',
    schema: {
      type: 'object',
      example: {
        error: 'UnauthorizedException',
        message: 'Incorrect id, unauthorized',
      },
    },
  })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Returns if token is invalid',
    schema: {
      type: 'object',
      example: {
        error: 'ForbiddenException',
        message: 'Invalid token',
      },
    },
  })
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
  @ApiOkResponse({
    status: 200,
    description: 'Returns if logging out is success',
    schema: {
      type: 'object',
      example: {
        data: 'Logged out',
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Returns if access token is not provided',
    schema: {
      type: 'object',
      example: {
        error: 'UnauthorizedException',
        message: 'Access Token is not provided',
      },
    },
  })
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
