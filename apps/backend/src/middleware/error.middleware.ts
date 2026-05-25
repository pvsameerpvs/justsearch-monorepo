import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

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

function formatZodErrors(error: ZodError) {
  return error.errors.map((e) => ({
    path: e.path.join('.'),
    message: e.message,
  }));
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors: Array<{ path: string; message: string }> | undefined;

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = formatZodErrors(err);
  }

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
      message = 'Referenced resource does not exist. If this happened after placing an order, your session may be expired — please sign in again.';
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      code: isPostgresError(err) ? err.code : undefined,
    }),
  });
};
