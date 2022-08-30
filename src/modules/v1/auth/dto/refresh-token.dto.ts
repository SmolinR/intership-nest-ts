import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly userId: Types.ObjectId;
}
