import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Protect routes - verify JWT token and attach user to request
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Check for token in cookies (if cookie-parser is added later)
  // else if (req.cookies?.token) { token = req.cookies.token; }

  if (!token) {
    throw new ApiError(401, "Not authorized. No token provided.");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and attach to request
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found. Token is invalid.");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Not authorized. Token failed.");
  }
});

/**
 * Restrict routes to specific roles
 * @param  {...string} roles - allowed roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. ${req.user.role} role is not authorized for this action.`
      );
    }
    next();
  };
};
