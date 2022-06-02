import express from "express";
const router = express.Router();
import { createVehicleType ,getAllVehicles,getSingleVehicleType,editVehicleType} from "../controllers/vehicleController";
import { protect } from "../middlewares/authMIddleware.js";

router.post("/createVehicleType", protect, createVehicleType);
router.get("/getAllVehicles", protect, getAllVehicles);
router.get("/getSingleVehicleType/:id", protect, getSingleVehicleType);
router.post("/editVehicleType", protect, editVehicleType);
export default router;
