import express from "express";
import {
  getUserById,
  updateProfile,
  getAllUsers,
  deleteAccount,
  updateProfileValidation,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);

// Protected routes
router.put("/profile", protect, updateProfileValidation, validate, updateProfile);
router.delete("/me", protect, deleteAccount);

export default router;
