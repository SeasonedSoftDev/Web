import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class EventNameInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      tap({
        error: (err) => {
          err.eventName = Reflect.getMetadata(
            'message',
            (context.switchToWs() as any).handler,
          );
        },
      }),
    );
  }
}
