import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

// if i type AuthBearer eslint asks for 3 arguments, but i don`t need to use it, what can i do?
// eslint-disable-next-line @typescript-eslint/typedef
const AuthBearer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { headers } = ctx.switchToHttp().getRequest();

    if (!headers.authorization) {
      throw new UnauthorizedException('Access Token is not provided');
    }

    return headers.authorization.split(' ')[1];
  },
);

export default AuthBearer;
