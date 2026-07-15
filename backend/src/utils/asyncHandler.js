/**
 * Wraps an async Express route handler so that any thrown error
 * is automatically passed to the next() error middleware.
 *
 * Usage:
 *   router.get('/example', asyncHandler(async (req, res) => { ... }));
 *
 * @param {Function} fn - Async route handler (req, res, next) => Promise
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
