import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware that runs after express-validator validation chains.
 * If any validation errors exist, it throws a 400 ApiError with details.
 *
 * Usage:
 *   router.post(
 *     '/register',
 *     [body('email').isEmail(), body('password').isLength({ min: 6 })],
 *     validate,
 *     controller.register
 *   );
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    throw ApiError.badRequest('Validation failed', extractedErrors);
  }

  next();
};

export default validate;
