import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import UsersModule from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import JwtAccessStrategy from './strategies/access-token.strategy';
import JwtRefreshStrategy from './strategies/refresh-token.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import AuthRepository from './auth.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schema/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'secret',
    }),
  ],
  providers: [
    AuthService,
    AuthRepository,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
