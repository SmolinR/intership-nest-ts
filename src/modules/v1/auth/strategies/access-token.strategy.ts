import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserDocument } from '../../users/schemas/user.schema';

import { ITokenStrategy } from '../interfaces/token-strategy.interface';

@Injectable()
export default class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'AccessGuard',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_SECRET'),
    });
  }

  async validate(payload: UserDocument): Promise<ITokenStrategy> {
    return {
      id: payload._id,
      email: payload.email,
      name: payload.name,
    };
  }
}
