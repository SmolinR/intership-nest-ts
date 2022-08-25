import { PartialType, OmitType, ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';
import { SignUpDto } from '../../auth/dto/sign-up.dto';

export class UpdateUserDto extends PartialType(
  OmitType(SignUpDto, ['email', 'password'] as const),
) {
  @ApiProperty()
  readonly id: Types.ObjectId;

  @ApiProperty()
  @IsString()
  readonly name: string;
}
