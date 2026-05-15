import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

function isPostgresError(err: unknown): err is { code: string; message: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as { code: string }).code === 'string'
  );
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Postgres / Drizzle connection errors
  if (isPostgresError(err)) {
    if (err.code === 'ECONNREFUSED' || err.code === '28P01') {
      statusCode = 503;
      message = 'Database connection failed. Please try again later.';
    }
    if (err.code === '23505') {
      statusCode = 409;
      message = 'Resource already exists.';
    }
    if (err.code === '23503') {
      statusCode = 400;
      message = 'Referenced resource does not exist.';
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      code: isPostgresError(err) ? err.code : undefined,
    }),
  });
};
