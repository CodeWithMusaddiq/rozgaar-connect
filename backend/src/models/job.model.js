import mongoose from "mongoose";

/**
 * Job Schema
 * Posted by shop owners, applied by job seekers
 */
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    requirements: {
      type: String,
      required: [true, "Job requirements are required"],
      maxlength: [3000, "Requirements cannot exceed 3000 characters"],
    },
    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
    },
    salaryMin: {
      type: Number,
      required: [true, "Minimum salary is required"],
      min: [0, "Salary cannot be negative"],
    },
    salaryMax: {
      type: Number,
      required: [true, "Maximum salary is required"],
      min: [0, "Salary cannot be negative"],
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
      required: true,
    },
    experience: {
      type: String,
      required: [true, "Experience requirement is required"],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    // Reference to the owner who posted the job
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Shop info (denormalized for faster reads)
    shopName: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    // Number of applications received
    applicationCount: {
      type: Number,
      default: 0,
    },
    // View count
    viewCount: {
      type: Number,
      default: 0,
    },
    // Tags for filtering
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ location: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ salaryMin: 1, salaryMax: 1 });
jobSchema.index({ owner: 1 });
jobSchema.index({ title: "text", description: "text" }); // Text search

const Job = mongoose.model("Job", jobSchema);

export default Job;
