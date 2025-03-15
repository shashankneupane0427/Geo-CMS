import express from "express";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import GlobalError from "./Errors/GlobalError.js";
import userRoutes from "./routes/generalUsersRoute.js";
import autheticationRoutes from "./routes/authenticationRoutes.js";
import superAdmin from "./routes/superAdminRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import HttpError from "./Errors/HttpErros.js";
import provinceRoutes from "./routes/provinceUserRoutes.js";

configDotenv();
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(`Could not connect to database: ${err.message}`));

// Middleware
app.use(morgan("dev"));
app.use(
  cors({
    // Update this to include your Vercel deployment URL and any other frontend URLs
    origin: ["http://localhost:5173", "https://your-frontend-url.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the backend of the GEO CMS");
});
app.use("/api/v1/generalUsers", userRoutes);
app.use("/api/v1/authorities", autheticationRoutes);
app.use("/api/v1/superadmin", superAdmin);
app.use("/api/v1/provinceuser", provinceRoutes);

// 404 handler
app.use("*", (req, res, next) => {
  return next(new HttpError(404, `The URL ${req.originalUrl} was not found`));
});

// Error handler
app.use(GlobalError);

// Dynamic port for deployment environments like Vercel
const PORT = process.env.PORT || 5001;

// Export for Vercel serverless functions
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`App currently listening on port number ${PORT}`);
  });
}

export default app;