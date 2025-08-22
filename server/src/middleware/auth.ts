import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './errorHandler';
import { prisma } from '../index';

// Extend the Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-fallback-key';

export const generateToken = (payload: { id: number; email: string; role: string }): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null; // Invalid token
  }
};

// Middleware to protect routes
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createError('Authentication token required.', 401));
  }

  const token = authHeader.split(' ')[1];

  const decoded = verifyToken(token);
  if (!decoded) {
    return next(createError('Invalid or expired token.', 401));
  }

  // Optionally, fetch the user from the database to ensure they still exist
  // This adds a database call on every authenticated request
  try {
    const user = await prisma.user.findUnique({
      where: { id: (decoded as any).id },
      select: { id: true, email: true, role: true }, // Only select necessary fields
    });

    if (!user) {
      return next(createError('User associated with this token no longer exists.', 401));
    }
    
    req.user = user; // Attach user info to the request object
    next();
  } catch (dbError) {
    return next(createError('Failed to authenticate user.', 500));
  }
};

// Middleware to authorize based on user role
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      // This should ideally be caught by the 'authenticate' middleware first
      return next(createError('User not authenticated.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(createError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};