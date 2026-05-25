import jwt from "jsonwebtoken";

/**
 * Generate JWT token for authenticated user
 * @param {string} userId - MongoDB user ID
 * @returns {string} JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token string
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
