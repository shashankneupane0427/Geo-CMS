import express from "express";
import { protect } from "../controllers/authenticationController.js";
import { getAllUsers } from "../controllers/superAdminController.js";
const router = express.Router();

router.get("/allUsers", protect, getAllUsers);

export default router;
