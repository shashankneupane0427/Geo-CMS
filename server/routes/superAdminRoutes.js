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
router.get("/allData", getAllData);
router.delete("/user/:id", deleteUserData);
router.patch("/user/:id", updateUserData);
router.post("/users", addNewUser);

export default router;
