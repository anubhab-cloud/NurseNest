import { Request, Response, NextFunction } from 'express';

// Wraps async route handlers to catch errors and forward to error middleware
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
