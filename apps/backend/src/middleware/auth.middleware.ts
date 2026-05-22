import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import type { TokenPayload } from '../utils/jwt';

export interface AuthContext extends TokenPayload {}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.replace('Bearer ', '') ||
    '';

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.auth = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const userRole = req.auth.role;
    const userType = req.auth.type;
    // Accept either role match OR super_admin type for admin-only routes
    const isAllowed = roles.includes(userRole) || (roles.includes('super_admin') && userType === 'super_admin');
    if (!isAllowed) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
}

export function requireTenant(req: Request, res: Response, next: NextFunction) {
  if (!req.tenant) {
    return res.status(400).json({ message: 'Tenant context required' });
  }
  next();
}
