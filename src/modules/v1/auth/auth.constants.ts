import { IAuthConstants } from './interfaces/constants.interface';

const AuthConstants: IAuthConstants = {
  tokens: {
    access: {
      secret: process.env.ACCESS_SECRET,
      expiresIn: '2m',
    },
    refresh: {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '10m',
    },
  },
};

export default AuthConstants;
