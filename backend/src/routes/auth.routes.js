import express from "express";
import {
  register,
  login,
  getMe,
  updatePassword,
  registerValidation,
  loginValidation,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/password", protect, updatePassword);

export default router;
