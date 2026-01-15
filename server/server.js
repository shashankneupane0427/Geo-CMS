import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose"; // Import mongoose

import userRoutes from "./routes/generalUsersRoute.js";
import authRoutes from "./routes/authenticationRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import provinceRoutes from "./routes/provinceUserRoutes.js";
import GlobalError from "./Errors/GlobalError.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

// Connect to MongoDB
connectDB();

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
        return callback(
          new Error("CORS policy does not allow this origin"),
          false
        );
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
app.get("/", (req, res) =>
  res.json({ message: "Geo CMS Backend Running" })
);

// API routes
app.use("/api/v1/generalUsers", userRoutes);
app.use("/api/v1/authorities", authRoutes);
app.use("/api/v1/superadmin", superAdminRoutes);
app.use("/api/v1/provinceuser", provinceRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use(GlobalError);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
