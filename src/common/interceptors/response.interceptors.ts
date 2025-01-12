// 统一响应请求
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ResponseDto } from '../dto/response.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseDto<T>>
{
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        const message =
          context.switchToHttp().getResponse().statusMessage || 'Success';
        return new ResponseDto<T>(statusCode, message, data);
      }),
      catchError((error) => {
        const statusCode =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const message =
          error instanceof HttpException
            ? error.message
            : 'Internal Server Error';
        this.logger.error(`Error: ${message}`, error.stack);
        return throwError(() => new ResponseDto<T>(statusCode, message, null));
      }),
    );
  }
}
