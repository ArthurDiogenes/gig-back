import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const errorResponse = {
      statusCode: exception.getStatus(),
      message: 'Requisição falhou',
      errors: exception.getResponse()['message'],
      path: request.url,
    };

    response.status(exception.getStatus()).json(errorResponse);
  }
}
