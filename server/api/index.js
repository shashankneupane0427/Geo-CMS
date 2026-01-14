import app from "../server.js";
import dbConnect from "../dbConnect.js";

export default async function handler(req, res) {
  try {
    // Connect to DB
    await dbConnect();

    // Forward request to Express
    app(req, res);
  } catch (err) {
    console.error("Serverless function error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
