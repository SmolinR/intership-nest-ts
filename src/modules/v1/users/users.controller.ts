import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { Types } from 'mongoose';
import AccessGuard from 'src/guards/access.guard';
import WrapResponseInterceptor from 'src/interceptors/wrap-response.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiExtraModels(User)
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Returns list of all users',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(User),
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Returns when acccess token is not provided or expired',
    schema: {
      type: 'object',
      example: {
        error: 'UnauthorizedException',
        message: 'Unauthorized',
      },
    },
  })
  @UseGuards(AccessGuard)
  @Get('')
  getAll() {
    return this.userService.getAll();
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Returns authorized user profile',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(User),
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Returns when acccess token is not provided or expired',
    schema: {
      type: 'object',
      example: {
        error: 'UnauthorizedException',
        message: 'Unauthorized',
      },
    },
  })
  @UseGuards(AccessGuard)
  @Get('me')
  getUser(@Req() req: ExpressRequest) {
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    status: 200,
    description: 'Returns if user with introduced id was found',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(User),
        },
      },
    },
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Returns when user with introduced id not found',
    schema: {
      type: 'object',
      example: {
        error: 'NotFoundException',
        message: 'User not found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Returns when casting to ObjectId failed',
    schema: {
      type: 'object',
      example: {
        error: 'CastError',
        message:
          'Cast to ObjectId failed for value "23523452345234522345" (type string) at path "_id" for model "User"',
      },
    },
  })
  @Get(':id')
  getById(@Param('id') id: Types.ObjectId) {
    return this.userService.getById(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: 201,
    description: 'Returns if user creating is success',
  })
  @ApiBadRequestResponse({
    status: 400,
    description:
      'Returns if creation fails and a validation error is encountered',
  })
  @Post('create')
  async create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: 200,
    schema: {
      type: 'object',
      example: {
        data: {
          acknowledged: true,
          modifiedCount: 1,
          upsertedId: null,
          upsertedCount: 0,
          matchedCount: 1,
        },
      },
      description: 'Returns result of updating',
    },
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Returns when acccess token is not provided or expired',
    schema: {
      type: 'object',
      example: {
        error: 'UnauthorizedException',
        message: 'Unauthorized',
      },
    },
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Returns when user with introduced id not found',
    schema: {
      type: 'object',
      example: {
        error: 'NotFoundException',
        message: 'User not found',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  @Put('update')
  async update(@Body() data: UpdateUserDto) {
    return this.userService.getByIdAndUpdate(data);
  }
}
