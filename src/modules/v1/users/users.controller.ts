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
import { Request as ExpressRequest } from 'express';
import { Types } from 'mongoose';
import AccessGuard from 'src/guards/access.guard';
import WrapResponseInterceptor from 'src/interceptors/wrap-response.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessGuard)
  @Get('')
  getAll() {
    return this.userService.getAll();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessGuard)
  @Get('me')
  getUser(@Req() req: ExpressRequest) {
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getById(@Param('id') id: Types.ObjectId) {
    return this.userService.getById(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessGuard)
  @Put('update')
  async update(@Body() data: UpdateUserDto) {
    return this.userService.getByIdAndUpdate(data);
  }
}
