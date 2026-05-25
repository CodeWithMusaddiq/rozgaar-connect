import mongoose from "mongoose";

/**
 * Application Schema
 * Links job seekers to jobs they applied for
 */
const applicationSchema = new mongoose.Schema(
  {
    // The job being applied for
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    // The applicant (job seeker)
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The job owner (for quick access without populating job)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Application status
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "withdrawn"],
      default: "pending",
    },
    // Cover message from applicant
    coverMessage: {
      type: String,
      maxlength: [1000, "Cover message cannot exceed 1000 characters"],
      default: "",
    },
    // Resume/CV URL (optional)
    resumeUrl: {
      type: String,
      default: "",
    },
    // Owner's response message
    responseMessage: {
      type: String,
      maxlength: [1000, "Response message cannot exceed 1000 characters"],
      default: "",
    },
    // When the owner responded
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ applicant: 1, status: 1 });
applicationSchema.index({ owner: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
