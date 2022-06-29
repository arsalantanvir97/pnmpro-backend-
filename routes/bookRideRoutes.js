import express from "express";
const router = express.Router();
import { bookaRide } from "../controllers/bookRideController";
import { protect } from "../middlewares/authMIddleware.js";

router.post("/bookaRide", protect, bookaRide);
export default router;
