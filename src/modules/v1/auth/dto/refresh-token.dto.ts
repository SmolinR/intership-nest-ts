import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;

  @IsNotEmpty()
  readonly userId: Types.ObjectId;
}
