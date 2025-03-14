import express from "express";
import { protect } from "../controllers/authenticationController.js";
import {
  addNewUser,
  addPlace,
  deletePlace,
  deleteUserData,
  getAllData,
  imageUpload,
  updateUserData,
  uploadPlace,
} from "../controllers/superAdminController.js";
const router = express.Router();
import multer from "../middlewares/multer.js";

router.get("/allData", protect, getAllData);
router.delete("/user/:id", protect, deleteUserData);
router.patch("/user/:id", protect, updateUserData);
router.post("/users", protect, addNewUser);
router.delete("/places/:id", deletePlace);
router.post("/places/image", multer.single("file"), imageUpload);
router.post("/places/:id", uploadPlace);
router.post("/places/add/newPlace", addPlace);
export default router;
