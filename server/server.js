import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";

// Try to import one route first
let userRoutes = null;
try {
  console.log("Importing user routes...");
  const userRoutesModule = await import("./routes/generalUsersRoute.js");
  userRoutes = userRoutesModule.default;
  console.log("User routes imported successfully");
} catch (error) {
  console.error("Failed to import user routes:", error.message);
}

configDotenv();
const app = express();

// Database connection
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    console.log("Attempting database connection...");
    await mongoose.connect(process.env.DB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
};

// Basic middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://geo-cms.vercel.app"],
  credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.json());

// Test route with database
app.get("/", async (req, res) => {
  try {
    await connectToDatabase();
    res.json({
      message: "Server is working!",
      database: isConnected ? "Connected" : "Disconnected",
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test API route
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working!",
    status: "OK",
    routesLoaded: {
      userRoutes: !!userRoutes
    }
  });
});

// Add user routes if available
if (userRoutes) {
  app.use("/api/v1/generalUsers", userRoutes);
  console.log("User routes added to app");
}

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    message: "Internal server error",
    error: error.message
  });
});

export default app;