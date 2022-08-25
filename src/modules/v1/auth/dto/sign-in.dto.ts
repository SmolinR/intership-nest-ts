import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
  IsEmail,
} from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(3)
  @MaxLength(320)
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string;
}
