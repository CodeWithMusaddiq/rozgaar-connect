import { body } from "express-validator";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Validation rules for updating profile
 */
export const updateProfileValidation = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),
  body("location")
    .optional()
    .trim(),
  body("education")
    .optional()
    .trim(),
  body("experience")
    .optional()
    .trim(),
];

/**
 * @desc    Get user profile by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -isActive");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(
    new ApiResponse(200, { user }, "User fetched successfully")
  );
});

/**
 * @desc    Update own profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, bio, location, education, experience, skills, avatar, shopName, shopAddress } = req.body;

  const updateData = {};

  if (fullName) updateData.fullName = fullName;
  if (bio !== undefined) updateData.bio = bio;
  if (location !== undefined) updateData.location = location;
  if (education !== undefined) updateData.education = education;
  if (experience !== undefined) updateData.experience = experience;
  if (skills) updateData.skills = skills;
  if (avatar !== undefined) updateData.avatar = avatar;

  // Only owner can update shop details
  if (req.user.role === "owner") {
    if (shopName !== undefined) updateData.shopName = shopName;
    if (shopAddress !== undefined) updateData.shopAddress = shopAddress;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.status(200).json(
    new ApiResponse(200, { user }, "Profile updated successfully")
  );
});

/**
 * @desc    Get all users (admin-like, can be filtered)
 * @route   GET /api/users
 * @access  Public (can be restricted later)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, location, page = 1, limit = 20 } = req.query;

  const query = { isActive: true };

  if (role) query.role = role;
  if (location) query.location = { $regex: location, $options: "i" };

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const users = await User.find(query)
    .select("-password -isActive")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    }, "Users fetched successfully")
  );
});

/**
 * @desc    Delete own account
 * @route   DELETE /api/users/me
 * @access  Private
 */
export const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });

  res.status(200).json(
    new ApiResponse(200, null, "Account deactivated successfully")
  );
});
