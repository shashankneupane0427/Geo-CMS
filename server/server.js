import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Basic middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://geo-cms.vercel.app"],
  credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Server is working!",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Test API route
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working!",
    status: "OK"
  });
});

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