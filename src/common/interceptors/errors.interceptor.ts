import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ErrorResponse {
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        
        if (error instanceof HttpException) {
          status = error.getStatus();
          const response = error.getResponse();
          message = typeof response === 'string' ? response : (response as any).message || error.message;
        } else if (error.message) {
          message = error.message;
        }

        const errorResponse: ErrorResponse = {
          message,
          error: error.name || 'Error',
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        };

        return throwError(() => new HttpException(errorResponse, status));
      }),
    );
  }
} 