import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

/**
 * Validate request body using express-validator rules
 * Must be used after validation rules in route definitions
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    throw new ApiError(400, "Validation failed", extractedErrors);
  }

  next();
};
