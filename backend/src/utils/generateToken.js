import jwt from 'jsonwebtoken';

/**
 * Signs a JWT with the given user ID.
 *
 * @param {string} userId - The MongoDB _id of the user
 * @param {string} [expiresIn='7d'] - Token expiry duration
 * @returns {string} Signed JWT string
 */
const generateToken = (userId, expiresIn = '7d') => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};

export default generateToken;
