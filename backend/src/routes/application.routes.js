import express from "express";
import {
  applyForJob,
  getMyApplications,
  getReceivedApplications,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationById,
  applyValidation,
} from "../controllers/application.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

// Protected routes for seekers
router.post("/", protect, restrictTo("seeker"), applyValidation, validate, applyForJob);
router.get("/my-applications", protect, restrictTo("seeker"), getMyApplications);
router.delete("/:id", protect, restrictTo("seeker"), withdrawApplication);

// Protected routes for owners
router.get("/received", protect, restrictTo("owner"), getReceivedApplications);
router.put("/:id/status", protect, restrictTo("owner"), updateApplicationStatus);

// Shared protected route
router.get("/:id", protect, getApplicationById);

export default router;
