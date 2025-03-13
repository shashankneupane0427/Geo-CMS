import express from "express";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
import morgan from "morgan";

configDotenv();
const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());

app.listen(process.env.PORT_NUMBER, () => {
  console.log(
    `app currently listening on port number ${process.env.PORT_NUMBER}`
  );
});
