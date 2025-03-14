import express from "express";
import { getAllDistrictUser } from "../controllers/provinceController.js";

const router = express.Router();

router.get("/allDistrictUsers", getAllDistrictUser);

export default router;
