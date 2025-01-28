import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ValidationError } from 'class-validator';

import { ValidationException } from './validation-exception.filter';

import { AppError } from '@/shared/appError.util';
import { Environment } from '@/shared/environment.config';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  catch(err: any, host: ArgumentsHost): Response<JSON> {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    let status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;

    let message: { [x: string]: any } | string =
      'Be very dramatic!. Something has gone wrong';

    let data: { [x: string]: any } | undefined | string = undefined;

    if (err instanceof AppError) {
      switch (err.status) {
        case HttpStatus.BAD_REQUEST:
          message = err.message;
          break;
        case HttpStatus.GATEWAY_TIMEOUT:
          message = err.message;
          break;
      }
    }

    if (typeof err.message === 'string') {
      message = err.message;
    }

    if (process.env.NODE_ENV === Environment.DEVELOPMENT) {
      data = {
        message: err.message,
        stack: err.stack,
      };
    }

    if (err instanceof ValidationException) {
      if (err.errors instanceof Array) {
        data = err.errors.map((err: ValidationError) => ({
          property: err.property,
          constraints: Object.values(err.constraints),
        }));
      } else data = err.getResponse();
    }

    if (err instanceof JsonWebTokenError) {
      status = HttpStatus.UNAUTHORIZED;
    }

    return res.status(status).json({
      status,
      message,
      data,
    });
  }
}
