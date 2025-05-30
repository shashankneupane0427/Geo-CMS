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
  res.send("Welcome to the backend of the project");
});
app.use("/api/v1/generalUsers", userRoutes);
app.use("/api/v1/authorities", autheticationRoutes);
app.use("/api/v1/provinceuser", provinceRoutes);
app.use("/api/v1/superadmin", superAdmin);

// Error handler
app.use(GlobalError);

// For local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`App currently listening on port number ${PORT}`);
  });
}

// Export for Vercel
export default app;