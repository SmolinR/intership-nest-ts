import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export default class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      // here the same moment i don`t know how to type this
      // eslint-disable-next-line @typescript-eslint/typedef
      map((...args) => {
        return {
          data: args[0].data ?? args[0],
        };
      }),
    );
  }
}
