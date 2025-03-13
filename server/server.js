import express from "express";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import GlobalError from "./Errors/GlobalError.js";

configDotenv();
const app = express();
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(`couldnot connect to databse ${err.message}`));

app.use(morgan("dev"));
app.use(bodyParser.json());

app.use(GlobalError);
app.listen(process.env.PORT_NUMBER, () => {
  console.log(
    `app currently listening on port number ${process.env.PORT_NUMBER}`
  );
});
