import express from "express";
import { protect } from "../controllers/authenticationController.js";
import {
  addNewUser,
  deleteUserData,
  getAllData,
  getAllUsers,
  updateUserData,
} from "../controllers/superAdminController.js";
const router = express.Router();

router.get("/allUsers", protect, getAllUsers);
router.get("/allData", protect, getAllData);
router.delete("/user/:id", protect, deleteUserData);
router.patch("/user/:id", protect, updateUserData);
router.post("/users", protect, addNewUser);

export default router;
