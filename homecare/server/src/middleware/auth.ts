import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { User } from '../models';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
        email: string;
      };
    }
  }
}

// ─── JWT Authentication Middleware ─────────────────────────────────────────────

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as {
      userId: string;
      role: string;
      email: string;
    };

    // Verify user still exists and is active
    const user = await User.findById(decoded.userId).select('isActive role');
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'User account is deactivated' });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: 'Token expired' });
      return;
    }
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// ─── Role-Based Authorization ──────────────────────────────────────────────────

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions for this action',
      });
      return;
    }
    next();
  };
};
