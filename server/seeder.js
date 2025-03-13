import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import place from "./Models/places.js";
import nepaliDistricts from "./utils/placeData.js";
import AsyncError from "./Errors/AsyncError.js";
import user from "./Models/users.js";
configDotenv();
const app = express();
const userHaru = [
  {
    email: "district",
    password: "district",
    role: "district",
  },
  {
    email: "province",
    password: "province",
    role: "province",
  },
  {
    email: "admin",
    password: "admin",
    role: "admin",
  },
];
await mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("db connected successfully"))
  .catch((err) => console.log(`err occured`));

const seed = async () => {
  try {
    console.log("clearing the places collection");
    await place.deleteMany();
    console.log("Cleared the places");
    console.log(".........");
    console.log("seeding new data on the places collection");
    await place.insertMany(nepaliDistricts);
    await user.insertMany(userHaru);
    console.log("data seeded successfully");
  } catch (err) {
    console.log(`Error occurred while seeding : ${err.message}`);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  }
};

seed();
