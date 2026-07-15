import ApiError from '../utils/ApiError.js';

/**
 * Global error-handling middleware.
 * Catches all errors and returns a consistent JSON response.
 *
 * Must be registered AFTER all routes in server.js:
 *   app.use(errorHandler);
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error for development
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Error:', err.message);
    if (err.stack) {
      console.error(err.stack);
    }
  }

  // ── Prisma: Record not found ────────────────────────────────────
  if (err.code === 'P2025') {
    const message = 'Resource not found';
    error = ApiError.notFound(message);
  }

  // ── Prisma: Unique constraint violation ─────────────────────────
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    const message = `An account with this ${field} already exists`;
    error = ApiError.conflict(message);
  }

  // ── Prisma: Foreign key constraint failure ──────────────────────
  if (err.code === 'P2003') {
    const message = 'Related resource not found';
    error = ApiError.badRequest(message);
  }

  // ── Prisma: Invalid data / validation error ────────────────────
  if (err.code === 'P2006' || err.code === 'P2007' || err.code === 'P2011') {
    const message = err.message || 'Invalid data provided';
    error = ApiError.badRequest(message);
  }

  // ── JWT Errors ──────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token has expired, please log in again');
  }

  // ── Send Response ───────────────────────────────────────────────
  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: error.message || 'Internal Server Error',
  };

  // Include validation errors array if present
  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
