import express from "express";
import { protect } from "../controllers/authenticationController.js";
import {
  addNewUser,
  deletePlace,
  deleteUserData,
  getAllData,
  imageUpload,
  updateUserData,
} from "../controllers/superAdminController.js";
const router = express.Router();
import multer from "../middlewares/multer.js";

router.get("/allData", protect, getAllData);
router.delete("/user/:id", protect, deleteUserData);
router.patch("/user/:id", protect, updateUserData);
router.post("/users", protect, addNewUser);
router.delete("/places/:id", deletePlace);
router.post("/places/image", multer.single("file"), imageUpload);

export default router;
