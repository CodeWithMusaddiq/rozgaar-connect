import { body } from "express-validator";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

/**
 * Validation rules for registration
 */
export const registerValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[+]?[\d\s-]{10,15}$/)
    .withMessage("Please enter a valid phone number"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["seeker", "owner"])
    .withMessage("Role must be either seeker or owner"),
];

/**
 * Validation rules for login
 */
export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required"),
];

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, role, shopName, shopAddress } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  // Check phone uniqueness
  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    throw new ApiError(400, "User with this phone number already exists");
  }

  // Create user
  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    phone,
    password,
    role: role || "seeker",
    shopName: role === "owner" ? shopName : "",
    shopAddress: role === "owner" ? shopAddress : "",
  });

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json(
    new ApiResponse(201, {
      user,
      token,
    }, "User registered successfully")
  );
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email (include password for comparison)
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Check if user is active
  if (!user.isActive) {
    throw new ApiError(401, "Your account has been deactivated. Please contact support.");
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json(
    new ApiResponse(200, {
      user,
      token,
    }, "Login successful")
  );
});

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json(
    new ApiResponse(200, { user }, "User profile fetched successfully")
  );
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  const token = generateToken(user._id);

  res.status(200).json(
    new ApiResponse(200, { token }, "Password updated successfully")
  );
});
