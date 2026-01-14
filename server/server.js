import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";

import userRoutes from "./routes/generalUsersRoute.js";
import authRoutes from "./routes/authenticationRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import provinceRoutes from "./routes/provinceUserRoutes.js";
import GlobalError from "./Errors/GlobalError.js";

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  "https://geocmsproject.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        return callback(new Error("CORS policy does not allow this origin"), false);
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
app.get("/", (req, res) => res.json({ message: "Geo CMS Backend Running" }));

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

export default app;
