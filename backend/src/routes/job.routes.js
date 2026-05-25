import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  getNearbyJobs,
  jobValidation,
} from "../controllers/job.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllJobs);
router.get("/nearby", getNearbyJobs);
router.get("/:id", getJobById);

// Protected routes (Owner only)
router.post("/", protect, restrictTo("owner"), jobValidation, validate, createJob);
router.put("/:id", protect, restrictTo("owner"), jobValidation, validate, updateJob);
router.delete("/:id", protect, restrictTo("owner"), deleteJob);
router.get("/my/listings", protect, restrictTo("owner"), getMyJobs);

export default router;
