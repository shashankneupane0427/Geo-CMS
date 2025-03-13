import express from "express";
import { protect } from "../controllers/authenticationController.js";
import {
  getAllData,
  getAllUsers,
} from "../controllers/superAdminController.js";
const router = express.Router();

router.get("/allUsers", protect, getAllUsers);
router.get("/allData", getAllData);

export default router;
