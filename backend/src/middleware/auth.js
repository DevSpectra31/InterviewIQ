import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Protect routes — verifies JWT from Authorization header and
 * attaches the authenticated user to req.user.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('Not authorized — no token provided');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        bio: true,
        skills: true,
        experience: true,
        interviewCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw ApiError.unauthorized('User belonging to this token no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.unauthorized('Not authorized — invalid token');
  }
});

/**
 * Authorize by role — restricts access to users with specific roles.
 *
 * Usage:
 *   router.get('/admin', protect, authorize('ADMIN'), handler);
 *
 * @param  {...string} roles - Allowed roles (e.g. 'USER', 'ADMIN')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Role '${req.user?.role}' is not authorized to access this route`
      );
    }
    next();
  };
};
