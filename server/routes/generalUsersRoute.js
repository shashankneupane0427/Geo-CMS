import express from "express";
import { getAllPlaces } from "../controllers/generalUsersController.js";

const router = express.Router();

router.get("/places", getAllPlaces);

export default router;
