import { body } from "express-validator";
import Job from "../models/job.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Validation rules for creating/updating a job
 */
export const jobValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ max: 150 })
    .withMessage("Title cannot exceed 150 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Job description is required"),
  body("requirements")
    .trim()
    .notEmpty()
    .withMessage("Job requirements are required"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Job location is required"),
  body("salaryMin")
    .notEmpty()
    .withMessage("Minimum salary is required")
    .isNumeric()
    .withMessage("Salary must be a number"),
  body("salaryMax")
    .notEmpty()
    .withMessage("Maximum salary is required")
    .isNumeric()
    .withMessage("Salary must be a number"),
  body("type")
    .optional()
    .isIn(["Full-time", "Part-time", "Internship", "Contract"])
    .withMessage("Invalid job type"),
  body("experience")
    .trim()
    .notEmpty()
    .withMessage("Experience requirement is required"),
];

/**
 * @desc    Create a new job posting
 * @route   POST /api/jobs
 * @access  Private (Owner only)
 */
export const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    requirements,
    location,
    salaryMin,
    salaryMax,
    type,
    experience,
    category,
    tags,
  } = req.body;

  const job = await Job.create({
    title,
    description,
    requirements,
    location,
    salaryMin: Number(salaryMin),
    salaryMax: Number(salaryMax),
    type: type || "Full-time",
    experience,
    category: category || "General",
    tags: tags || [],
    owner: req.user._id,
    shopName: req.user.shopName || req.user.fullName,
  });

  res.status(201).json(
    new ApiResponse(201, { job }, "Job posted successfully")
  );
});

/**
 * @desc    Get all jobs with filtering, search, and pagination
 * @route   GET /api/jobs
 * @access  Public
 */
export const getAllJobs = asyncHandler(async (req, res) => {
  const {
    search,
    location,
    type,
    category,
    minSalary,
    maxSalary,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  const query = { status: "active" };

  // Text search on title and description
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Location filter
  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  // Job type filter
  if (type) {
    query.type = type;
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Salary range filter
  if (minSalary || maxSalary) {
    query.$and = query.$and || [];
    if (minSalary) {
      query.$and.push({ salaryMax: { $gte: Number(minSalary) } });
    }
    if (maxSalary) {
      query.$and.push({ salaryMin: { $lte: Number(maxSalary) } });
    }
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOrder = order === "asc" ? 1 : -1;

  const jobs = await Job.find(query)
    .populate("owner", "fullName shopName avatar phone")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ [sortBy]: sortOrder });

  const total = await Job.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    }, "Jobs fetched successfully")
  );
});

/**
 * @desc    Get single job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate(
    "owner",
    "fullName shopName avatar phone location"
  );

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Increment view count
  job.viewCount += 1;
  await job.save();

  res.status(200).json(
    new ApiResponse(200, { job }, "Job fetched successfully")
  );
});

/**
 * @desc    Update a job posting
 * @route   PUT /api/jobs/:id
 * @access  Private (Owner only)
 */
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Check ownership
  if (job.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own job postings");
  }

  const allowedUpdates = [
    "title",
    "description",
    "requirements",
    "location",
    "salaryMin",
    "salaryMax",
    "type",
    "experience",
    "category",
    "tags",
    "status",
  ];

  const updateData = {};
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  // Convert salary numbers
  if (updateData.salaryMin) updateData.salaryMin = Number(updateData.salaryMin);
  if (updateData.salaryMax) updateData.salaryMax = Number(updateData.salaryMax);

  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.status(200).json(
    new ApiResponse(200, { job: updatedJob }, "Job updated successfully")
  );
});

/**
 * @desc    Delete a job posting
 * @route   DELETE /api/jobs/:id
 * @access  Private (Owner only)
 */
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Check ownership
  if (job.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own job postings");
  }

  await Job.findByIdAndDelete(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "Job deleted successfully")
  );
});

/**
 * @desc    Get jobs posted by logged-in owner
 * @route   GET /api/jobs/my-jobs
 * @access  Private (Owner only)
 */
export const getMyJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { owner: req.user._id };
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const jobs = await Job.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Job.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    }, "Your jobs fetched successfully")
  );
});

/**
 * @desc    Get nearby jobs (simple location-based search)
 * @route   GET /api/jobs/nearby
 * @access  Public
 */
export const getNearbyJobs = asyncHandler(async (req, res) => {
  const { location, radius = 10, page = 1, limit = 10 } = req.query;

  if (!location) {
    throw new ApiError(400, "Location is required for nearby search");
  }

  const query = {
    status: "active",
    location: { $regex: location, $options: "i" },
  };

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const jobs = await Job.find(query)
    .populate("owner", "fullName shopName avatar")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Job.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    }, "Nearby jobs fetched successfully")
  );
});
