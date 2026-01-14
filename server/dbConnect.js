import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    cached.conn = conn;
    console.log("MongoDB connected");
    return conn;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
}

export default dbConnect;
