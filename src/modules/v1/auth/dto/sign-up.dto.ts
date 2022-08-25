import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
  IsEmail,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(3)
  @MaxLength(320)
  readonly email: string = '';

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  readonly name: string = '';

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string = '';
}
