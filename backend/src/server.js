import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/fouz_ki_dukaan";

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet());

// Enable CORS for frontend
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

// Request logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Response compression
app.use(compression());

// Parse JSON and URL-encoded bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================
// ROUTES
// ============================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fouz Ki Dukaan API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/chat", chatRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

// ============================================
// DATABASE CONNECTION & SERVER START
// ============================================

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=====================================`);
    console.log(`  Fouz Ki Dukaan Server`);
    console.log(`  Running on port: ${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`=====================================`);
  });
});

export default app;
