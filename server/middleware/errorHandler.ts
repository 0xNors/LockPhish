import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error('[API Error]', {
    path: req.path,
    method: req.method,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed on input payload.',
      code: 'VALIDATION_ERROR',
      details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
    });
    return;
  }

  if (err.name === 'UnauthorizedError' || err.status === 401) {
    res.status(401).json({
      error: err.message || 'Unauthorized',
      code: 'UNAUTHORIZED'
    });
    return;
  }

  if (err.status === 403 || err.code === 'FORBIDDEN') {
    res.status(403).json({
      error: err.message || 'Forbidden access',
      code: 'FORBIDDEN'
    });
    return;
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error occurred.',
    code: err.code || 'INTERNAL_SERVER_ERROR'
  });
}
