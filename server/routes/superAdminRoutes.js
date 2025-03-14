import express from "express";
import { protect } from "../controllers/authenticationController.js";
import {
  addNewUser,
  deletePlace,
  deleteUserData,
  getAllData,
  updateUserData,
} from "../controllers/superAdminController.js";
const router = express.Router();

router.get("/allData", protect, getAllData);
router.delete("/user/:id", protect, deleteUserData);
router.patch("/user/:id", protect, updateUserData);
router.post("/users", protect, addNewUser);
router.delete("/places/:id", deletePlace);

export default router;
