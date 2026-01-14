// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";

import userRoutes from "./routes/generalUsersRoute.js";
import authRoutes from "./routes/authenticationRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import provinceRoutes from "./routes/provinceUserRoutes.js";
import GlobalError from "./Errors/GlobalError.js";

dotenv.config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Middleware
const allowedOrigins = [
  "https://geocmsproject.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Geo CMS Backend Running" });
});

// API routes
app.use("/api/v1/generalUsers", userRoutes);
app.use("/api/v1/authorities", authRoutes);
app.use("/api/v1/superadmin", superAdminRoutes);
app.use("/api/v1/provinceuser", provinceRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found", path: req.originalUrl });
});

// Global error handler
app.use(GlobalError);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
