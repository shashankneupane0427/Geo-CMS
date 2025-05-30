import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";

// Try to import all routes and error handler
let userRoutes = null;
let autheticationRoutes = null;
let superAdmin = null;
let provinceRoutes = null;
let GlobalError = null;

try {
  console.log("Importing user routes...");
  const userRoutesModule = await import("./routes/generalUsersRoute.js");
  userRoutes = userRoutesModule.default;
  console.log("User routes imported successfully");
} catch (error) {
  console.error("Failed to import user routes:", error.message);
}

try {
  console.log("Importing auth routes...");
  const authRoutesModule = await import("./routes/authenticationRoutes.js");
  autheticationRoutes = authRoutesModule.default;
  console.log("Auth routes imported successfully");
} catch (error) {
  console.error("Failed to import auth routes:", error.message);
}

try {
  console.log("Importing super admin routes...");
  const superAdminModule = await import("./routes/superAdminRoutes.js");
  superAdmin = superAdminModule.default;
  console.log("Super admin routes imported successfully");
} catch (error) {
  console.error("Failed to import super admin routes:", error.message);
}

try {
  console.log("Importing province routes...");
  const provinceRoutesModule = await import("./routes/provinceUserRoutes.js");
  provinceRoutes = provinceRoutesModule.default;
  console.log("Province routes imported successfully");
} catch (error) {
  console.error("Failed to import province routes:", error.message);
}

try {
  console.log("Importing GlobalError...");
  const globalErrorModule = await import("./Errors/GlobalError.js");
  GlobalError = globalErrorModule.default;
  console.log("GlobalError imported successfully");
} catch (error) {
  console.error("Failed to import GlobalError:", error.message);
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

// Add morgan for logging (since it was in your original)
import morgan from "morgan";
app.use(morgan("dev"));

// Test route with database
app.get("/", async (req, res) => {
  try {
    await connectToDatabase();
    res.json({
      message: "Welcome to the backend of the project",
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
      userRoutes: !!userRoutes,
      autheticationRoutes: !!autheticationRoutes,
      superAdmin: !!superAdmin,
      provinceRoutes: !!provinceRoutes,
      GlobalError: !!GlobalError
    }
  });
});

// Add all routes if available
if (userRoutes) {
  app.use("/api/v1/generalUsers", userRoutes);
  console.log("User routes added to app");
}

if (autheticationRoutes) {
  app.use("/api/v1/authorities", autheticationRoutes);
  console.log("Auth routes added to app");
}

if (provinceRoutes) {
  app.use("/api/v1/provinceuser", provinceRoutes);
  console.log("Province routes added to app");
}

if (superAdmin) {
  app.use("/api/v1/superadmin", superAdmin);
  console.log("Super admin routes added to app");
}

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler
if (GlobalError) {
  app.use(GlobalError);
  console.log("GlobalError handler added");
} else {
  app.use((error, req, res, next) => {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  });
  console.log("Default error handler added");
}

// For local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`App currently listening on port number ${PORT}`);
  });
}

export default app;