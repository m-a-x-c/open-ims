import { ErrorRequestHandler } from 'express';
import config from '../config';
import CustomError from '../errors/customError';

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const errorResponse = {
    success: false,
    statusCode: 500,
    message: 'Internal Server Error!',
    errors: {},
    stack: config.nodeEnv === 'dev' ? err.stack : null
  };

  if (err instanceof CustomError) {
    errorResponse.statusCode = err.statusCode;
    errorResponse.message = err.message;
  }

  return res.status(errorResponse.statusCode).json(errorResponse);
};

export default globalErrorHandler;
