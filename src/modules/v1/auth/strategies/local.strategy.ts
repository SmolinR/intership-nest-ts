import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import IUserOutput from '../interfaces/validated-user-output';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(
    username: string,
    password: string,
  ): Promise<IUserOutput | null> {
    const user: IUserOutput | null = await this.authService.validateUser(
      username,
      password,
    );

    console.log(user);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
