import { body } from "express-validator";
import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Validation for application submission
 */
export const applyValidation = [
  body("jobId")
    .notEmpty()
    .withMessage("Job ID is required"),
  body("coverMessage")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Cover message cannot exceed 1000 characters"),
];

/**
 * @desc    Apply for a job
 * @route   POST /api/applications
 * @access  Private (Seeker only)
 */
export const applyForJob = asyncHandler(async (req, res) => {
  const { jobId, coverMessage, resumeUrl } = req.body;

  // Check if job exists and is active
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  if (job.status !== "active") {
    throw new ApiError(400, "This job is no longer accepting applications");
  }

  // Prevent owner from applying to own job
  if (job.owner.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot apply to your own job posting");
  }

  // Check if already applied
  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: req.user._id,
  });

  if (existingApplication) {
    throw new ApiError(400, "You have already applied for this job");
  }

  // Create application
  const application = await Application.create({
    job: jobId,
    applicant: req.user._id,
    owner: job.owner,
    coverMessage: coverMessage || "",
    resumeUrl: resumeUrl || "",
  });

  // Increment job application count
  job.applicationCount += 1;
  await job.save();

  // Populate for response
  const populatedApp = await Application.findById(application._id)
    .populate("job", "title location salaryMin salaryMax type")
    .populate("applicant", "fullName email phone avatar")
    .populate("owner", "fullName shopName");

  res.status(201).json(
    new ApiResponse(201, { application: populatedApp }, "Application submitted successfully")
  );
});

/**
 * @desc    Get all applications for logged-in user
 * @route   GET /api/applications/my-applications
 * @access  Private (Seeker)
 */
export const getMyApplications = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const query = { applicant: req.user._id };
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const applications = await Application.find(query)
    .populate("job", "title location salaryMin salaryMax type shopName")
    .populate("owner", "fullName shopName phone")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Application.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    }, "Your applications fetched successfully")
  );
});

/**
 * @desc    Get all applications for owner's jobs
 * @route   GET /api/applications/received
 * @access  Private (Owner)
 */
export const getReceivedApplications = asyncHandler(async (req, res) => {
  const { status, jobId, page = 1, limit = 10 } = req.query;

  const query = { owner: req.user._id };
  if (status) query.status = status;
  if (jobId) query.job = jobId;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const applications = await Application.find(query)
    .populate("job", "title location salaryMin salaryMax type")
    .populate("applicant", "fullName email phone avatar location education experience skills")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Application.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    }, "Received applications fetched successfully")
  );
});

/**
 * @desc    Update application status (Accept/Reject)
 * @route   PUT /api/applications/:id/status
 * @access  Private (Owner)
 */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, responseMessage } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    throw new ApiError(400, "Status must be 'accepted' or 'rejected'");
  }

  const application = await Application.findById(req.params.id);

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  // Verify ownership
  if (application.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only manage applications for your own jobs");
  }

  application.status = status;
  application.responseMessage = responseMessage || "";
  application.respondedAt = new Date();
  await application.save();

  const populatedApp = await Application.findById(application._id)
    .populate("job", "title location")
    .populate("applicant", "fullName email phone avatar");

  res.status(200).json(
    new ApiResponse(200, { application: populatedApp }, `Application ${status} successfully`)
  );
});

/**
 * @desc    Withdraw an application
 * @route   DELETE /api/applications/:id
 * @access  Private (Seeker)
 */
export const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  // Verify applicant
  if (application.applicant.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only withdraw your own applications");
  }

  // Only allow withdrawal if still pending
  if (application.status !== "pending") {
    throw new ApiError(400, "Cannot withdraw an application that has already been processed");
  }

  // Decrement job application count
  await Job.findByIdAndUpdate(application.job, {
    $inc: { applicationCount: -1 },
  });

  await Application.findByIdAndDelete(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "Application withdrawn successfully")
  );
});

/**
 * @desc    Get single application by ID
 * @route   GET /api/applications/:id
 * @access  Private
 */
export const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate("job", "title location salaryMin salaryMax type shopName")
    .populate("applicant", "fullName email phone avatar location education experience skills")
    .populate("owner", "fullName shopName phone");

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  // Verify user has access to this application
  const isApplicant = application.applicant._id.toString() === req.user._id.toString();
  const isOwner = application.owner._id.toString() === req.user._id.toString();

  if (!isApplicant && !isOwner) {
    throw new ApiError(403, "You do not have access to this application");
  }

  res.status(200).json(
    new ApiResponse(200, { application }, "Application fetched successfully")
  );
});
