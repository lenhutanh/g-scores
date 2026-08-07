import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ERROR_CODES } from 'src/constants/error-code';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string = ERROR_CODES.VALIDATION_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resObj = exception.getResponse() as any;

      code = resObj?.code || (status === HttpStatus.NOT_FOUND ? ERROR_CODES.NOT_FOUND : ERROR_CODES.BAD_REQUEST);
      message = resObj?.message || exception.message;
    }

    response.status(status).json({
      success: false,
      code,
      message: Array.isArray(message) ? message.join(', ') : message,
    });
  }
}
