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

configDotenv();
const app = express();
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(`couldnot connect to databse ${err.message}`));

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/api/v1/generalUsers", userRoutes);
app.use("/api/v1/authorities", autheticationRoutes);
app.use("/api/v1/superadmin", superAdmin);

app.use(GlobalError);
app.listen(process.env.PORT_NUMBER, () => {
  console.log(
    `app currently listening on port number ${process.env.PORT_NUMBER}`
  );
});
