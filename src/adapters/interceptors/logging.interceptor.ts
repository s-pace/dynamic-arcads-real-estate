import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as dd from 'dd-trace';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data: any) => {
          const responseTime = Date.now() - startTime;

          // Log to console using NestJS Logger
          this.logger.log(
            `${method} ${url} ${responseTime}ms - UserAgent: ${userAgent}`,
          );

          // Send metrics to Datadog
          const span = dd.tracer.scope().active();
          if (span) {
            span.setTag('http.method', method);
            span.setTag('http.url', url);
            span.setTag('http.response_time', responseTime);
            span.setTag('http.user_agent', userAgent);
          }
        },
        error: (error: any) => {
          const responseTime = Date.now() - startTime;

          // Log error to console using NestJS Logger
          this.logger.error(
            `${method} ${url} ${responseTime}ms - Error: ${error.message}`,
            error.stack,
          );

          // Send error to Datadog
          const span = dd.tracer.scope().active();
          if (span) {
            span.setTag('error', true);
            span.setTag('error.message', error.message);
            span.setTag('error.stack', error.stack);
          }
        },
      }),
    );
  }
}
