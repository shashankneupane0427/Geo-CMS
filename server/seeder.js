import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import place from "./Models/places.js";
import nepaliSchools from "./utils/placeData.js";
import AsyncError from "./Errors/AsyncError.js";
import user from "./Models/users.js";
configDotenv();
const app = express();
const userHaru = [
  {
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
    province: "N/A",
    district: [],
  },
  {
    email: "bagmatiprovince@gmail.com",
    password: "bagmatiprovince123",
    role: "Province User",
    province: "Bagmati Province",
    district: [],
  },
  {
    email: "kathmandudistrict@gmail.com",
    password: "kathmandudistrict123",
    role: "District User",
    province: "Bagmati Province",
    district: ["Kathmandu", "Lalitpur"],
  },
  {
    email: "user2@geo.com",
    password: "user456",
    role: "District User",
    province: "Gandaki Province",
    district: ["Kaski"],
  },
  {
    email: "manager@geo.com",
    password: "manager123",
    role: "Province User",
    province: "Province 1",
    district: [],
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
    await place.insertMany(nepaliSchools);
    await user.deleteMany();
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
