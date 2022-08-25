import { Response as ExpressResponse } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { IAllExceptionResponse } from '../interfaces/all-exception-response.interface';
import { IMongoCodes } from 'src/interfaces/mongo-codes.interface';
import { IErrorBody } from 'src/interfaces/all-exceptions-error-body.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const res: ExpressResponse = ctx.getResponse<ExpressResponse>();
    const exceptionResponse: null | IAllExceptionResponse =
      exception.getResponse
        ? (exception.getResponse() as IAllExceptionResponse)
        : null;
    const status: number = exception.getStatus ? exception.getStatus() : 500;

    const mongodbCodes: IMongoCodes = {
      bulkWriteError: 11000,
    };

    if (exception.code === mongodbCodes.bulkWriteError) {
      return res.status(HttpStatus.CONFLICT).json({
        error: 'Mongoose duplicated key',
        message: exception.message,
      });
    }

    const errorBody: IErrorBody = {
      error: exception.name,
      message: exception.message,
    };

    if (exceptionResponse) {
      if (Array.isArray(exceptionResponse.message)) {
        Reflect.set(errorBody, 'messages', exceptionResponse.message);
      } else {
        Reflect.set(errorBody, 'message', exceptionResponse.message);
      }
    }

    return res.status(status).json(errorBody);
  }
}
