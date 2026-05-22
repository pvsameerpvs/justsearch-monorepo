import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '30m';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export interface TokenPayload {
  id: string;
  name: string;
  role: string;
  restaurantId?: string;
  type: 'customer' | 'staff' | 'delivery' | 'super_admin';
}

export interface RefreshPayload {
  sub: string;
  name: string;
  role: string;
  type: 'refresh';
  userType: 'customer' | 'staff' | 'delivery' | 'super_admin';
  restaurantId?: string;
}

/**
 * Legacy single-token signing. Kept for backward compatibility
 * during migration. Prefer signAccessToken for new flows.
 */
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: (process.env.JWT_EXPIRY || '24h') as jwt.SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRY as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET);
  // Reject refresh tokens — they are for /auth/refresh only
  if ((decoded as Record<string, unknown>).type === 'refresh') {
    throw new Error('Refresh token cannot be used as access token');
  }
  return decoded as TokenPayload;
}

export function signRefreshToken(
  userId: string,
  name: string,
  role: string,
  userType: RefreshPayload['userType'],
  restaurantId?: string
): string {
  return jwt.sign(
    { sub: userId, name, role, type: 'refresh', userType, restaurantId },
    JWT_SECRET,
    { expiresIn: REFRESH_EXPIRY as jwt.SignOptions['expiresIn'] }
  );
}

export function verifyRefreshToken(token: string): RefreshPayload {
  return jwt.verify(token, JWT_SECRET) as RefreshPayload;
}
