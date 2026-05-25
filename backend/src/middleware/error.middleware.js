import ApiError from "../utils/ApiError.js";

/**
 * Global error handling middleware
 * Catches all errors and sends consistent JSON responses
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If not an ApiError, wrap it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, "Validation Error", messages);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(400, `${field} already exists`);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token. Please log in again.");
  }

  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Token expired. Please log in again.");
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors.length > 0 ? error.errors : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
